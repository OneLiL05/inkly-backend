import { fromNodeHeaders } from 'better-auth/node'
import type { FastifyReply, FastifyRequest } from 'fastify'

export const isAuthorized = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const { auth } = request.diScope.cradle

	const session = await auth.api.getSession({
		headers: fromNodeHeaders(request.headers),
	})

	if (!session) {
		return reply.status(401).send({ message: 'Unauthorized' })
	}

	request.userId = session.session.userId
}
