import { z } from 'zod';

// Zod schema for contact form validation
export const createContactSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z.string().email('Email inválido'),
  subject: z.string().min(1, 'Assunto é obrigatório').max(100, 'Assunto deve ter no máximo 100 caracteres'),
  message: z.string().min(1, 'Mensagem é obrigatória').max(1000, 'Mensagem deve ter no máximo 1000 caracteres'),
});

export type CreateContactRequest = z.infer<typeof createContactSchema>;

export interface ContactResponse {
  success: boolean;
  message: string;
}