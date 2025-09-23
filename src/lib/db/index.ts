import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Database connection
let db: ReturnType<typeof drizzle> | null = null;

export type DrizzleDB = NonNullable<typeof db>;

export const getDatabase = () => {
    if (!db) {
        const connectionString = process.env.DATABASE_URL;

        if (!connectionString) {
            console.warn("DATABASE_URL environment variable is not set - database functionality will be disabled");
            return null;
        }

        try {
            // Configure postgres client
            const client = postgres(connectionString, {
                max: 1, // Use a single connection for serverless
                idle_timeout: 20,
                connect_timeout: 60,
            });

            // Create drizzle instance
            db = drizzle(client, { schema });
        } catch (error) {
            console.error("Failed to connect to database:", error);
            return null;
        }
    }

    return db;
};

// Export schema and types
export * from "./schema";
export { getDatabase as db };
