import type { FastifyReply, FastifyRequest } from 'fastify'

export const retrieveActivityLogs = async (
	request: FastifyRequest,
	reply: FastifyReply,
): Promise<void> => {
	const { activityLogRepository } = request.diScope.cradle

	const logs = await activityLogRepository.retirieveAll()

	await reply.send(logs)
}
