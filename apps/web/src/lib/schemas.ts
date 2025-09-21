import { z } from "zod";

// Schema de validação para o formulário de contato
export const contactFormSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório").max(255, "Nome muito longo").trim(),
    email: z
        .string()
        .min(1, "Email é obrigatório")
        .email("Por favor, insira um email válido")
        .max(255, "Email muito longo")
        .toLowerCase(),
    message: z.string().min(1, "Mensagem é obrigatória").max(5000, "Mensagem muito longa").trim(),
});

// Tipo TypeScript derivado do schema
export type ContactFormData = z.infer<typeof contactFormSchema>;

// Schema para resposta da API
export const contactResponseSchema = z.object({
    id: z.number(),
    message: z.string(),
    timestamp: z.string(),
});

export type ContactResponse = z.infer<typeof contactResponseSchema>;

// Schema para erro da API
export const contactErrorSchema = z.object({
    error: z.string(),
    message: z.string(),
    timestamp: z.string(),
});

export type ContactError = z.infer<typeof contactErrorSchema>;
