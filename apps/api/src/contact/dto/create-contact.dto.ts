import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { z } from 'zod';

export class CreateContactDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  subject: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  message: string;
}

// Zod schema for additional validation
export const createContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(100),
  message: z.string().min(1).max(1000),
});

export type CreateContactType = z.infer<typeof createContactSchema>;