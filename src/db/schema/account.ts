import { relations, sql } from 'drizzle-orm'
import { index, pgTable } from 'drizzle-orm/pg-core'
import { userTable } from './user.js'

export const accountTable = pgTable(
	'account',
	(t) => ({
		id: t
			.uuid('id')
			.default(sql`uuidv7()`)
			.primaryKey(),
		accountId: t.text().notNull(),
		providerId: t.text().notNull(),
		userId: t
			.uuid()
			.notNull()
			.references(() => userTable.id, { onDelete: 'cascade' }),
		accessToken: t.text(),
		refreshToken: t.text(),
		idToken: t.text(),
		accessTokenExpiresAt: t.timestamp({ withTimezone: true }),
		refreshTokenExpiresAt: t.timestamp({ withTimezone: true }),
		scope: t.text(),
		password: t.text(),
		createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
		updatedAt: t
			.timestamp()
			.$onUpdate(() => new Date())
			.notNull(),
	}),
	(table) => [index('account_userId_idx').on(table.userId)],
)

export const accountRelations = relations(accountTable, ({ one }) => ({
	user: one(userTable, {
		fields: [accountTable.userId],
		references: [userTable.id],
	}),
}))
