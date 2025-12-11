import type { FastifyReply, FastifyRequest } from 'fastify'
import { ManuscriptNotFoundError } from '../errors/index.js'
import type {
	CreateManuscript,
	GetManuscript,
	UpdateManuscript,
} from '../schemas/index.js'

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

		return reply.status(result.error.code).send(result.error.toObject())
	}

	return reply.status(200).send(result.value)
}

export const createManuscript = async (
	request: FastifyRequest<{ Body: CreateManuscript }>,
	reply: FastifyReply,
): Promise<void> => {
	const { manuscriptsRepository, logger } = request.diScope.cradle

	const result = await manuscriptsRepository.createOne(request.body)

	if (result.isErr()) {
		logger.error(`Failed to create manuscript: ${result.error.message}`)

		return reply.status(result.error.code).send(result.error.toObject())
	}

	logger.info(
		`New manuscript in organization '${request.body.organizationId}' created`,
	)

	return reply.status(201).send(result.value)
}

export const updateManuscript = async (
	request: FastifyRequest<{
		Params: GetManuscript
		Body: UpdateManuscript
	}>,
	reply: FastifyReply,
): Promise<void> => {
	const { id } = request.params
	const { manuscriptsRepository, logger } = request.diScope.cradle

	const exists = await manuscriptsRepository.existsById(id)

	if (!exists) {
		const error = new ManuscriptNotFoundError(id)

		logger.warn(`Manuscript with id '${id}' not found`)

		return reply.status(error.code).send(error.toObject())
	}

	await manuscriptsRepository.updateById(id, request.body)

	logger.info(`Manuscript with id '${id}' updated`)

	return reply.status(204).send()
}

export const deleteManuscript = async (
	request: FastifyRequest<{ Params: GetManuscript }>,
	reply: FastifyReply,
): Promise<void> => {
	const { id } = request.params
	const { manuscriptsRepository, logger } = request.diScope.cradle

	const exists = await manuscriptsRepository.existsById(id)

	if (!exists) {
		const error = new ManuscriptNotFoundError(id)

		logger.warn(`Manuscript with id '${id}' not found`)

		return reply.status(error.code).send(error.toObject())
	}

	await manuscriptsRepository.deleteById(id)

	logger.info(`Manuscript with id '${id}' deleted`)

	return reply.status(204).send()
}
