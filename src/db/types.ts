import type { organizationTable } from './schema/organization.js'
import type { userTable } from './schema/user.js'

type User = typeof userTable.$inferSelect
type Organization = typeof organizationTable.$inferSelect

export type { User, Organization }
