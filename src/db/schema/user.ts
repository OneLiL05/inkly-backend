import { relations, sql } from 'drizzle-orm'
import { pgTable } from 'drizzle-orm/pg-core'
import { sessionTable } from './session.js'
import { accountTable } from './account.js'

export const userTable = pgTable('user', (t) => ({
	id: t
		.uuid('id')
		.default(sql`uuidv7()`)
		.primaryKey(),
	name: t.text().notNull(),
	email: t.text().notNull().unique(),
	emailVerified: t.boolean().default(false).notNull(),
	image: t.text(),
	createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
	updatedAt: t
		.timestamp({ withTimezone: true })
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
	username: t.text().unique(),
	displayUsername: t.text(),
	role: t.text(),
	banned: t.boolean().default(false),
	banReason: t.text(),
	banExpires: t.timestamp({ withTimezone: true }),
	lastLoginMethod: t.text(),
	fullName: t.text().notNull(),
	locale: t.text().default('en'),
}))

export const userTableRelations = relations(userTable, ({ many }) => ({
	sessions: many(sessionTable),
	accounts: many(accountTable),
}))
