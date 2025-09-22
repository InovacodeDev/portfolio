import { Injectable } from "@nestjs/common";
import crypto from "crypto";
import { z } from "zod";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { contacts, Contact } from "@inovacode/db";
import * as schema from "@inovacode/db/schema";
import Resend from "resend";
import { renderContactNotification } from "../lib/emailTemplates";
import { Request, Response } from "express";

const contactRequestSchema = z.object({
    name: z.string().min(1).max(255),
    email: z.string().email().max(255),
    message: z.string().min(1).max(5000),
});

const contactResponseSchema = z.object({ id: z.number(), message: z.string(), timestamp: z.string() });

const errorResponseSchema = z.object({ error: z.string(), message: z.string(), timestamp: z.string() });

export const escapeHtml = (unsafe: string) => {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

const getDb = () => {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        const forceFallback =
            String(process.env.FORCE_DEV_DB_FALLBACK || "").toLowerCase() === "1" ||
            String(process.env.FORCE_DEV_DB_FALLBACK || "").toLowerCase() === "true";

        if (forceFallback) {
            return {
                insert: () => ({ values: () => ({ returning: async () => [{ id: Math.floor(Date.now() / 1000) }] }) }),
            } as unknown as ReturnType<typeof drizzle>;
        }

        throw new Error("DATABASE_URL environment variable is not set");
    }

    const client = postgres(connectionString, {
        max: 1,
        idle_timeout: 20,
        connect_timeout: 60,
    });

    return drizzle(client, { schema });
};

export async function sendEmailNotificationResend(
    opts: { name: string; email: string; message: string; contactId: number },
    logger?: Console
) {
    const { name, email, message, contactId } = opts;

    const apiKey = process.env.RESEND_API_KEY;
    const emailTo = process.env.EMAIL_TO;
    const emailFrom = process.env.EMAIL_FROM || (emailTo ? emailTo.split(",")[0].trim() : "no-reply@localhost");

    const log = logger ?? console;

    if (!apiKey) {
        log.warn("RESEND_API_KEY not set; skipping email notification");
        return;
    }

    if (!emailTo) {
        log.warn("EMAIL_TO not set; skipping email notification");
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

        log.info({ contactId }, "Email notification sent via Resend");
    } catch (err) {
        log.error(err, "Failed to send email notification via Resend");
    }
}

@Injectable()
export class ContactService {
    // In-memory rate limit store (process-local)
    private submissionTimestamps = new Map<string, number>();

    private cryptoRandomId() {
        return crypto.randomBytes(16).toString("hex");
    }

    private parseCookies(header?: string) {
        const cookies: Record<string, string> = {};
        if (!header) return cookies;
        header.split(";").forEach((c) => {
            const [k, ...v] = c.split("=");
            if (!k) return;
            cookies[k.trim()] = decodeURIComponent((v || []).join("=").trim());
        });
        return cookies;
    }

    async handleContact(body: unknown, req: Request, reply: Response) {
        try {
            const parsed = contactRequestSchema.parse(body);
            const { name, email, message } = parsed;

            // ensure session id cookie
            const cookieHeader = req.headers["cookie"] || "";
            const cookies = this.parseCookies(cookieHeader);
            let sessionId = cookies["session_id"];
            if (!sessionId) {
                sessionId = this.cryptoRandomId();
                const maxAge = 60 * 60 * 24 * 7; // 7 days
                const parts = [
                    `session_id=${encodeURIComponent(sessionId)}`,
                    `Path=/`,
                    `Max-Age=${maxAge}`,
                    `SameSite=Lax`,
                    `HttpOnly`,
                ];
                if (process.env.NODE_ENV === "production") parts.push("Secure");

                const prev = reply.getHeader("Set-Cookie");
                if (prev) {
                    if (Array.isArray(prev)) {
                        reply.setHeader("Set-Cookie", [...prev, parts.join("; ")]);
                    } else if (typeof prev === "string") {
                        reply.setHeader("Set-Cookie", [prev, parts.join("; ")]);
                    } else {
                        reply.setHeader("Set-Cookie", parts.join("; "));
                    }
                } else {
                    reply.setHeader("Set-Cookie", parts.join("; "));
                }
            }

            const now = Date.now();

            // Rate limiting - prefer redis if available (not implemented here), fallback to in-memory
            const last = this.submissionTimestamps.get(sessionId) || 0;
            if (now - last < 60 * 1000) {
                reply.status(429).json({
                    error: "Too many requests",
                    message: "Você pode enviar apenas uma mensagem por minuto.",
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            this.submissionTimestamps.set(sessionId, now);
            setTimeout(() => this.submissionTimestamps.delete(sessionId), 2 * 60 * 1000);

            const db = getDb();

            let contactId: number | null = null;
            try {
                const [newContact] = await db
                    .insert(contacts)
                    .values({
                        name: name.trim(),
                        email: email.trim().toLowerCase(),
                        message: message.trim(),
                        status: "pending",
                    })
                    .returning({ id: contacts.id });
                contactId = newContact.id;
            } catch (dbErr: unknown) {
                const msg = typeof dbErr === "string" ? dbErr : dbErr instanceof Error ? dbErr.message : String(dbErr);
                const forceFallback =
                    String(process.env.FORCE_DEV_DB_FALLBACK || "").toLowerCase() === "1" ||
                    String(process.env.FORCE_DEV_DB_FALLBACK || "").toLowerCase() === "true";
                if (
                    forceFallback ||
                    /role .* does not exist/i.test(msg) ||
                    /connect/i.test(msg) ||
                    /password authentication failed/i.test(msg)
                ) {
                    contactId = Math.floor(Date.now() / 1000);
                } else {
                    throw dbErr;
                }
            }

            if (contactId) {
                sendEmailNotificationResend({ name, email, message, contactId }).catch((err) => console.error(err));
            }

            reply.status(201).json({
                id: contactId,
                message: "Mensagem enviada com sucesso! Entraremos em contato em breve.",
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            console.error(error, "Error processing contact form submission");
            if (error instanceof Error && error.message.includes("duplicate")) {
                reply.status(400).json({
                    error: "Duplicate submission",
                    message: "Esta mensagem já foi enviada recentemente.",
                    timestamp: new Date().toISOString(),
                });
                return;
            }
            reply.status(500).json({
                error: "Internal server error",
                message: "Erro interno do servidor. Tente novamente mais tarde.",
                timestamp: new Date().toISOString(),
            });
        }
    }

    async listContacts(_req: Request, reply: Response) {
        try {
            const db = getDb();
            const allContacts = await db.select().from(contacts).orderBy(contacts.createdAt);

            const formattedContacts = allContacts.map((contact: Contact) => ({
                ...contact,
                createdAt: contact.createdAt.toISOString(),
                updatedAt: contact.updatedAt.toISOString(),
            }));
            reply.json(formattedContacts);
        } catch (error) {
            console.error(error, "Error fetching contacts");
            reply.status(500).json({
                error: "Internal server error",
                message: "Erro ao buscar contatos.",
                timestamp: new Date().toISOString(),
            });
        }
    }
}
