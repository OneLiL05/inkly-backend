import { relations } from 'drizzle-orm'
import { pgTable } from 'drizzle-orm/pg-core'
import { baseTableAttrs } from '../utils.js'
import { commentTable } from './comment.js'
import { organizationTable } from './organization.js'
import { userTable } from './user.js'

export const memberTable = pgTable('member', (t) => ({
	id: baseTableAttrs.id,
	createdAt: baseTableAttrs.createdAt,
	role: t.text().default('member').notNull(),
	organizationId: t
		.uuid()
		.notNull()
		.references(() => organizationTable.id, { onDelete: 'cascade' }),
	userId: t
		.uuid()
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),
}))

export const memberTableRelations = relations(memberTable, ({ one, many }) => ({
	organization: one(organizationTable, {
		fields: [memberTable.organizationId],
		references: [organizationTable.id],
	}),
	user: one(userTable, {
		fields: [memberTable.userId],
		references: [userTable.id],
	}),
	comments: many(commentTable),
}))
