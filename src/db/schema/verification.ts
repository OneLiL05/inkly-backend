import { sql } from 'drizzle-orm'
import { index, pgTable } from 'drizzle-orm/pg-core'

export const verificationTable = pgTable(
	'verification',
	(t) => ({
		id: t
			.uuid()
			.default(sql`uuidv7()`)
			.primaryKey(),
		identifier: t.text().notNull(),
		value: t.text().notNull(),
		expiresAt: t.timestamp({ withTimezone: true }).notNull(),
		createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
		updatedAt: t
			.timestamp({ withTimezone: true })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	}),
	(t) => [index('verification_identifier_idx').on(t.identifier)],
)
