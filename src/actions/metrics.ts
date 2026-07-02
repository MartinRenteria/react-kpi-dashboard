'use server'; // Tells Next.js: "Compile this code to run strictly on the server"

import { db } from '@/db';
import { metrics } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Define a strict schema using Zod to validate data before touching Postgres
const MetricSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    value: z.number().min(0, "Value cannot be negative"),
    category: z.string().min(2, "Category is required"),
    type: z.enum(['count', 'percentage', 'currency']),
});

// Define a structure for what our frontend UI can expect back from the server
export type ActionState = {
    success: boolean;
    errors?: {
        name?: string[];
        value?: string[];
        category?: string[];
        global?: string;
    };
};

/**
 * Creates a new metric entry in our database.
 * @param prevState - Used by React's useActionState to track prior component states
 * @param formData - The standard web API FormData object submitted directly from the HTML form
 */
export async function createMetric(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
    // 1. Extract and sanitize input elements from the native FormData object
    const validatedFields = MetricSchema.safeParse({
        name: formData.get('name'),
        value: Number(formData.get('value')),
        category: formData.get('category'),
        type: formData.get('type'),
    });

    // 2. If validation fails, immediately send the error arrays back to the UI
    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        // 3. Direct DB Insert (No API endpoints required!)
        await db.insert(metrics).values({
            name: validatedFields.data.name,
            value: validatedFields.data.value,
            category: validatedFields.data.category,
            type: validatedFields.data.type,
        });

        // 4. Cache Purging (The Magic Step)
        // Tells Next.js to immediately purge the static page layout cache for '/'
        // and re-pull fresh database rows so the user instantly sees their new card.
        revalidatePath('/');

        return { success: true };
    } catch (error) {
        console.error("Database write error:", error);
        return {
            success: false,
            errors: { global: "Failed to write metric entry to the database." },
        };
    }
}