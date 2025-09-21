import { pgTable, serial, text, timestamp, varchar, pgEnum } from 'drizzle-orm/pg-core';

// Enum para status dos contatos
export const contactStatusEnum = pgEnum('contact_status', ['pending', 'read', 'archived']);

// Tabela principal para armazenar as submissões do formulário.
export const contacts = pgTable('contacts', {
  // `serial` é um atalho para um inteiro auto-increment, ideal para chaves primárias.
  id: serial('id').primaryKey(),
  
  // `varchar` com um limite razoável para nomes e emails previne entradas excessivamente longas.
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  
  // `text` é usado para a mensagem pois não tem um limite de tamanho prático, acomodando mensagens longas.
  message: text('message').notNull(),
  
  // O status default 'pending' simplifica a lógica de inserção. O backend não precisa especificar o status inicial.
  status: contactStatusEnum('status').default('pending').notNull(),
  
  // `defaultNow()` automaticamente insere o timestamp atual na criação, essencial para auditoria.
  createdAt: timestamp('created_at').defaultNow().notNull(),
  
  // `updatedAt` é crucial para rastrear quando um registro foi modificado pela última vez.
  // A lógica para auto-atualizar este campo será implementada na camada de serviço.
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Export dos tipos TypeScript derivados do schema
export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
