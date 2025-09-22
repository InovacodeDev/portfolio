import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import crypto from "crypto";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { contacts, Contact } from "@inovacode/db";
import * as schema from "@inovacode/db/schema";
import Resend from "resend";
import { renderContactNotification } from "../lib/emailTemplates";

// Helper para obter conexão com banco de dados
const getDb = () => {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error("DATABASE_URL environment variable is not set");
    }

    const client = postgres(connectionString, {
        max: 1,
        idle_timeout: 20,
        connect_timeout: 60,
    });

    return drizzle(client, { schema });
};

// Schema de validação para o corpo da requisição
const contactRequestSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório").max(255, "Nome muito longo"),
    email: z.string().email("Email inválido").max(255, "Email muito longo"),
    message: z.string().min(1, "Mensagem é obrigatória").max(5000, "Mensagem muito longa"),
});

// Schema de resposta de sucesso
const contactResponseSchema = z.object({
    id: z.number(),
    message: z.string(),
    timestamp: z.string(),
});

// Schema de resposta de erro
const errorResponseSchema = z.object({
    error: z.string(),
    message: z.string(),
    timestamp: z.string(),
});

// Minimal HTML escape for message body
export const escapeHtml = (unsafe: string) => {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

// Helper to send email notifications using Resend API
export async function sendEmailNotificationResend(
    opts: { name: string; email: string; message: string; contactId: number },
    logger?: Partial<{
        info: (...args: unknown[]) => void;
        warn: (...args: unknown[]) => void;
        error: (...args: unknown[]) => void;
    }>
) {
    const { name, email, message, contactId } = opts;

    const apiKey = process.env.RESEND_API_KEY;
    const emailTo = process.env.EMAIL_TO;
    const emailFrom = process.env.EMAIL_FROM || (emailTo ? emailTo.split(",")[0].trim() : "no-reply@localhost");

    const log = logger ?? console;

    if (!apiKey) {
        log.warn?.("RESEND_API_KEY not set; skipping email notification");
        return;
    }

    if (!emailTo) {
        log.warn?.("EMAIL_TO not set; skipping email notification");
        return;
    }

    try {
        const resend = new Resend(apiKey);

        const subject = `New contact form submission (#${contactId})`;
        const plain = `New contact form submission\n\nID: ${contactId}\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`;
        const html = renderContactNotification({
            contactId,
            name,
            email,
            messageHtml: escapeHtml(message),
            timestamp: new Date().toISOString(),
        });

        await resend.emails.send({
            from: emailFrom,
            to: emailTo.split(",").map((s) => s.trim()),
            subject,
            text: plain,
            html,
        });

        log.info?.({ contactId }, "Email notification sent via Resend");
    } catch (err) {
        log.error?.(err, "Failed to send email notification via Resend");
    }
}

declare module "fastify" {
    interface FastifyRequest {
        sessionId?: string;
    }
}

export async function contactRoutes(fastify: FastifyInstance) {
    const server = fastify.withTypeProvider<ZodTypeProvider>();

    // Simple in-memory store to track last submission timestamp per session id
    // NOTE: In a multi-instance production environment this should be replaced
    // with a shared store (Redis, database, etc.). For Vercel serverless it's
    // best-effort; we'll use a cookie-based session id plus the in-memory Map
    // to protect against rapid repeated submissions from the same client.
    const submissionTimestamps = new Map<string, number>();
    // Lazy import for redis helper (optional)
    let safeSetRateLimit: ((sessionId: string, ttlSeconds?: number) => Promise<boolean>) | null = null;
    if (process.env.REDIS_URL) {
        try {
            // dynamic import to avoid requiring ioredis when not used
            const redisMod = require("../lib/redis") as typeof import("../lib/redis");
            safeSetRateLimit = redisMod.safeSetRateLimit;
        } catch (err) {
            server.log.warn(err, "Failed to load redis client; falling back to in-memory rate limiter");
            safeSetRateLimit = null;
        }
    }

    // Middleware to ensure session cookie exists and attach sessionId to request
    // helper to generate a short random id
    function cryptoRandomId() {
        return crypto.randomBytes(16).toString("hex");
    }

    server.addHook("preHandler", async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const cookieName = "session_id";
            // @ts-ignore: Fastify augmented types from @fastify/cookie
            let sessionId = (request.cookies as Record<string, string> | undefined)?.[cookieName];

            if (!sessionId) {
                // create a simple random session id
                sessionId = cryptoRandomId();
                // set cookie for 7 days
                // @ts-ignore: setCookie is provided by @fastify/cookie
                reply.setCookie(cookieName, sessionId, {
                    path: "/",
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 60 * 60 * 24 * 7,
                });
            }

            // attach to request for handlers to use
            // @ts-ignore - extend request object dynamically
            request.sessionId = sessionId;
        } catch (err) {
            server.log.warn(err, "Failed to ensure session cookie");
        }
    });

    // ...existing code...

    // Endpoint para submissão do formulário de contato
    server.post(
        "/contact",
        {
            schema: {
                body: contactRequestSchema,
                response: {
                    201: contactResponseSchema,
                    400: errorResponseSchema,
                    500: errorResponseSchema,
                },
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                // request.body is validated by the route schema; cast to known shape
                const body = request.body as { name: string; email: string; message: string };
                const { name, email, message } = body;
                const sessionId: string | undefined = request.sessionId;
                const now = Date.now();

                // Rate limiting: prefer Redis if configured, otherwise fallback to in-memory Map
                if (sessionId) {
                    if (safeSetRateLimit) {
                        // safeSetRateLimit returns true when allowed (key set), false when already exists
                        const allowed = await safeSetRateLimit(sessionId, 60);
                        if (!allowed) {
                            server.log.info({ sessionId }, "Rate limit: submission blocked (redis)");
                            reply.code(429).send({
                                error: "Too many requests",
                                message: "Você pode enviar apenas uma mensagem por minuto.",
                                timestamp: new Date().toISOString(),
                            });
                            return;
                        }
                    } else {
                        const last = submissionTimestamps.get(sessionId) || 0;
                        const diff = now - last;
                        if (diff < 60 * 1000) {
                            server.log.info({ sessionId }, "Rate limit: submission blocked");
                            reply.code(429).send({
                                error: "Too many requests",
                                message: "Você pode enviar apenas uma mensagem por minuto.",
                                timestamp: new Date().toISOString(),
                            });
                            return;
                        }
                        // record timestamp
                        submissionTimestamps.set(sessionId, now);
                        // schedule cleanup after 2 minutes to prevent memory leak
                        setTimeout(() => submissionTimestamps.delete(sessionId), 2 * 60 * 1000);
                    }
                }
                const db = getDb();

                // Log da tentativa de submissão
                server.log.info({ email, name: name.substring(0, 10) + "..." }, "Contact form submission");

                // Inserir no banco de dados
                const [newContact] = await db
                    .insert(contacts)
                    .values({
                        name: name.trim(),
                        email: email.trim().toLowerCase(),
                        message: message.trim(),
                        status: "pending",
                    })
                    .returning({ id: contacts.id });

                server.log.info({ contactId: newContact.id }, "Contact saved to database");

                // Enviar notificação por email de forma assíncrona (não bloquear resposta)
                sendEmailNotificationResend({ name, email, message, contactId: newContact.id }).catch((err) => {
                    server.log.error(err, "Error sending contact notification email");
                });

                reply.code(201).send({
                    id: newContact.id,
                    message: "Mensagem enviada com sucesso! Entraremos em contato em breve.",
                    timestamp: new Date().toISOString(),
                });
            } catch (error) {
                server.log.error(error, "Error processing contact form submission");

                // Verificar se é erro de validação do banco
                if (error instanceof Error && error.message.includes("duplicate")) {
                    reply.code(400).send({
                        error: "Duplicate submission",
                        message: "Esta mensagem já foi enviada recentemente.",
                        timestamp: new Date().toISOString(),
                    });
                    return;
                }

                // Erro genérico do servidor
                reply.code(500).send({
                    error: "Internal server error",
                    message: "Erro interno do servidor. Tente novamente mais tarde.",
                    timestamp: new Date().toISOString(),
                });
            }
        }
    );

    // Endpoint para listar contatos (para administração futura)
    server.get(
        "/contacts",
        {
            schema: {
                response: {
                    200: z.array(
                        z.object({
                            id: z.number(),
                            name: z.string(),
                            email: z.string(),
                            message: z.string(),
                            status: z.enum(["pending", "read", "archived"]),
                            createdAt: z.string(),
                            updatedAt: z.string(),
                        })
                    ),
                    500: errorResponseSchema,
                },
            },
        },
        async (request, reply) => {
            try {
                const db = getDb();
                const allContacts = await db.select().from(contacts).orderBy(contacts.createdAt);

                const formattedContacts = allContacts.map((contact: Contact) => ({
                    ...contact,
                    createdAt: contact.createdAt.toISOString(),
                    updatedAt: contact.updatedAt.toISOString(),
                }));

                reply.send(formattedContacts);
            } catch (error) {
                server.log.error(error, "Error fetching contacts");
                reply.code(500).send({
                    error: "Internal server error",
                    message: "Erro ao buscar contatos.",
                    timestamp: new Date().toISOString(),
                });
            }
        }
    );
}
