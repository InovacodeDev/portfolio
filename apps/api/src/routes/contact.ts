import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { contacts, Contact } from "@inovacode/db";
import * as schema from "@inovacode/db/schema";

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

export async function contactRoutes(fastify: FastifyInstance) {
    const server = fastify.withTypeProvider<ZodTypeProvider>();

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
        async (request, reply) => {
            try {
                const { name, email, message } = request.body;
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

                // TODO: Implementar notificação por email
                // await sendEmailNotification({ name, email, message, contactId: newContact.id });

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
