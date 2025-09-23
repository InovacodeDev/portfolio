import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '@inovacode/db/schema';

export type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;