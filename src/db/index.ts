import { drizzle } from 'drizzle-orm/pg-core';
import { Pool } from 'pg';
import * as schema from './schema';

// Prevent multiple connections in development due to Next.js hot-reloading
const globalForDb = globalThis as unknown as { conn: Pool | undefined };

const pool = globalForDb.conn ?? new Pool({
    connectionString: process.env.DATABASE_URL,
});

if (process.env.NODE_ENV !== 'production') globalForDb.conn = pool;

export const db = drizzle(pool, { schema });