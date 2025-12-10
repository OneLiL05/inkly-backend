import type { FastifyReply, FastifyRequest } from 'fastify'
import type { GetManuscript } from '../schemas/index.js'
import { ManuscriptNotFoundError } from '../errors/index.js'

export const getManuscript = async (
	request: FastifyRequest<{ Params: GetManuscript }>,
	reply: FastifyReply,
): Promise<void> => {
	const { id } = request.params
	const { manuscriptsRepository, logger } = request.diScope.cradle

	const manuscript = await manuscriptsRepository.findById(id)

	const result = manuscript.toResult(new ManuscriptNotFoundError(id))

	if (result.isErr()) {
		logger.warn(`Manuscript with id '${id}' not found`)

		return reply
			.status(result.error.code)
			.send({ message: result.error.message })
	}

	return reply.status(200).send(result.value)
}
