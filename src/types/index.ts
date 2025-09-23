import { z } from "zod";

// Contact Form Schema and Types
export const contactFormSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório").max(255, "Nome muito longo").trim(),
    email: z
        .string()
        .min(1, "Email é obrigatório")
        .email("Por favor, insira um email válido")
        .max(255, "Email muito longo")
        .toLowerCase(),
    subject: z.string().min(1, "Assunto é obrigatório").max(255, "Assunto muito longo").trim(),
    message: z.string().min(1, "Mensagem é obrigatória").max(5000, "Mensagem muito longa").trim(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// API Response Schemas and Types
export const contactResponseSchema = z.object({
    success: z.boolean(),
    id: z.number().optional(),
    message: z.string(),
    timestamp: z.string(),
});

export type ContactResponse = z.infer<typeof contactResponseSchema>;

export const contactErrorSchema = z.object({
    success: z.boolean(),
    error: z.string(),
    message: z.string(),
    timestamp: z.string(),
});

export type ContactError = z.infer<typeof contactErrorSchema>;

// Generic API Types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
