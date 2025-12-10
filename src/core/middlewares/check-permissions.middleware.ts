import { fromNodeHeaders } from 'better-auth/node'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { PermissionsRecord } from '../types/permissions.js'

export const checkPermissions = (permissions: PermissionsRecord) => {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		const { auth } = request.diScope.cradle

		const hasPermissions = await auth.api.hasPermission({
			headers: fromNodeHeaders(request.headers),
			body: {
				permissions,
			},
		})

		if (!hasPermissions.success) {
			return reply
				.status(403)
				.send({ message: "You don't have the required permissions" })
		}
	}
}
