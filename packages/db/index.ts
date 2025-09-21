import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Database connection
let db: ReturnType<typeof drizzle> | null = null;

export const getDatabase = () => {
  if (!db) {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    // Configure postgres client
    const client = postgres(connectionString, {
      max: 1, // Use a single connection for serverless
      idle_timeout: 20,
      connect_timeout: 60,
    });

    // Create drizzle instance
    db = drizzle(client, { schema });
  }
  
  return db;
};

// Export schema and types
export * from './schema';
export type Database = ReturnType<typeof getDatabase>;