import { pgTable } from 'drizzle-orm/pg-core'
import { baseTableAttrs } from '../utils.js'

export const organizationTable = pgTable('organization', (t) => ({
	id: baseTableAttrs.id,
	createdAt: baseTableAttrs.createdAt,
	name: t.text().notNull(),
	slug: t.text().notNull().unique(),
	logo: t.text(),
	metadata: t.text(),
}))
