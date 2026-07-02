import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const globalForDb = globalThis as unknown as { conn: Pool | undefined };

const pool = globalForDb.conn ?? new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: true }
        : { rejectUnauthorized: false }
});

if (process.env.NODE_ENV !== 'production') globalForDb.conn = pool;

export const db = drizzle({ client: pool, schema });