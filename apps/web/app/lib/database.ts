import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@inovacode/db/schema';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn('DATABASE_URL environment variable is not set');
}

// Create postgres client only if DATABASE_URL is available
const client = databaseUrl ? postgres(databaseUrl, {
  max: 1, // Limit connections for serverless
  idle_timeout: 20,
  connect_timeout: 10,
}) : null;

// Create drizzle database instance
export const db = client ? drizzle(client, { schema }) : null;

export type DrizzleDB = typeof db;