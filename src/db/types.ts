import type { fileTable } from './schema/file.js'
import type { manuscriptTable } from './schema/manuscript.js'
import type { organizationTable } from './schema/organization.js'
import type { tagTable } from './schema/tag.js'
import type { userTable } from './schema/user.js'

type User = typeof userTable.$inferSelect
type Organization = typeof organizationTable.$inferSelect
type Manuscript = typeof manuscriptTable.$inferSelect
type File = typeof fileTable.$inferSelect
type Tag = typeof tagTable.$inferSelect

export type { File, Manuscript, Organization, Tag, User }
