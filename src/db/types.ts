import type { manuscriptTable } from './schema/manuscript.js'
import type { organizationTable } from './schema/organization.js'
import type { userTable } from './schema/user.js'

type User = typeof userTable.$inferSelect
type Organization = typeof organizationTable.$inferSelect
type Manuscript = typeof manuscriptTable.$inferSelect

export type { User, Organization, Manuscript }
