import type { fileTable } from './schema/file.js'
import type { manuscriptTagTable } from './schema/manuscript-tag.js'
import type { manuscriptTable } from './schema/manuscript.js'
import type { organizationTable } from './schema/organization.js'
import type { tagTable } from './schema/tag.js'
import type { userTable } from './schema/user.js'

type User = typeof userTable.$inferSelect
type Organization = typeof organizationTable.$inferSelect
type RawManuscript = typeof manuscriptTable.$inferSelect
type Manuscript = RawManuscript & {
	tags: Omit<Tag, 'organizationId'>[]
}
type ManuscriptTag = typeof manuscriptTagTable.$inferSelect
type File = typeof fileTable.$inferSelect
type Tag = typeof tagTable.$inferSelect

export type {
	File,
	Manuscript,
	Organization,
	Tag,
	User,
	RawManuscript,
	ManuscriptTag,
}
