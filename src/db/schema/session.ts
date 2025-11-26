import { relations, sql } from 'drizzle-orm'
import { index, pgTable } from 'drizzle-orm/pg-core'
import { userTable } from './user.js'

export const sessionTable = pgTable(
	'session',
	(t) => ({
		id: t
			.uuid('id')
			.default(sql`uuidv7()`)
			.primaryKey(),
		expiresAt: t.timestamp({ withTimezone: true }).notNull(),
		token: t.text().notNull().unique(),
		createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
		updatedAt: t
			.timestamp({ withTimezone: true })
			.$onUpdate(() => new Date())
			.notNull(),
		ipAddress: t.text(),
		userAgent: t.text(),
		userId: t
			.uuid('user_id')
			.notNull()
			.references(() => userTable.id, { onDelete: 'cascade' }),
		impersonatedBy: t.text(),
	}),
	(table) => [index('session_userId_idx').on(table.userId)],
)

export const sessionTableRelations = relations(sessionTable, ({ one }) => ({
	user: one(userTable, {
		fields: [sessionTable.userId],
		references: [userTable.id],
	}),
}))
