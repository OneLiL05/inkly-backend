import { pgTable } from 'drizzle-orm/pg-core'
import { baseTableAttrs } from '../utils.js'
import { manuscriptTable } from './manuscript.js'
import { memberTable } from './member.js'

export const publishingStageTable = pgTable('publishing_stage', (t) => ({
	id: baseTableAttrs.id,
	startedAt: baseTableAttrs.createdAt,
	finishedAt: t.timestamp({ withTimezone: true, mode: 'date' }),
	deadlineAt: t.timestamp({ withTimezone: true, mode: 'date' }),
	name: t.varchar().notNull(),
	description: t.text(),
	completedBy: t
		.uuid()
		.references(() => memberTable.id, { onDelete: 'set null' }),
	manuscriptId: t
		.uuid()
		.notNull()
		.references(() => manuscriptTable.id, { onDelete: 'cascade' }),
}))
