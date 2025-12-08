import { relations } from 'drizzle-orm'
import { pgTable } from 'drizzle-orm/pg-core'
import { baseTableAttrs } from '../utils.js'
import { manuscriptTagTable } from './manuscript-tag.js'

export const tagTable = pgTable('tag', (t) => ({
	id: baseTableAttrs.id,
	name: t.varchar().notNull().unique(),
	color: t.varchar().notNull(),
}))

export const tagsTableRelations = relations(tagTable, ({ many }) => ({
	manuscripts: many(manuscriptTagTable),
}))
