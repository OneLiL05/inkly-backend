import * as schema from '@/db/schema/index.js'
import { betterAuth, nodeENV } from 'better-auth'
import {
	admin,
	haveIBeenPwned,
	lastLoginMethod,
	multiSession,
	username,
	openAPI,
} from 'better-auth/plugins'
import type { AuthInjectableDependencies } from '../types/index.js'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

export const initBetterAuth = (deps: AuthInjectableDependencies) => {
	const { db, secondaryStorage, passwordService } = deps

	const authSchema = {
		account: schema.accountTable,
		session: schema.sessionTable,
		user: schema.userTable,
		verification: schema.verificationTable,
	}

	return betterAuth({
		database: drizzleAdapter(db, { provider: 'pg', schema: authSchema }),
		secondaryStorage,
		user: {
			additionalFields: {
				fullName: {
					type: 'string',
					required: true,
				},
				locale: {
					type: 'string',
					required: false,
					defaultValue: 'en',
				},
			},
		},
		emailAndPassword: {
			enabled: true,
			password: passwordService,
		},
		advanced: {
			useSecureCookies: nodeENV === 'production',
			cookiePrefix: 'inkly',
			cookies: {
				session_token: {
					name: 'inkly_session_token',
				},
			},
			database: {
				generateId: 'uuid',
			},
		},
		plugins: [
			username(),
			admin({ adminRoles: ['admin', 'employee'] }),
			multiSession(),
			lastLoginMethod({
				cookieName: 'proofly.last_used_login_method',
				storeInDatabase: true,
			}),
			haveIBeenPwned({
				customPasswordCompromisedMessage:
					'Please choose a more secure password',
			}),
			openAPI({ disableDefaultReference: true }),
		],
		experimental: {
			joins: true,
		},
	})
}
