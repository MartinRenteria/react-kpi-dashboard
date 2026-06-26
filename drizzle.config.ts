import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environmental variables from your local env
dotenv.config({ path: '.env.local' });

const config = defineConfig({
    schema: './src/db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});

export default config;