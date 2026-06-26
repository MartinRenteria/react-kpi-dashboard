import { pgTable, serial, text, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const metricTypeEnum = pgEnum('metric_type', ['count', 'percentage', 'currency']);

export const metrics = pgTable('metrics', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    value: integer('value').notNull(),
    type: metricTypeEnum('type').default('count').notNull(),
    category: text('category').notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});