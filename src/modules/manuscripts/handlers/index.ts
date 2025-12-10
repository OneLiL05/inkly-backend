import type { FastifyReply, FastifyRequest } from 'fastify'
import type {
	CreateManuscript,
	GetManuscript,
	UpdateManuscript,
} from '../schemas/index.js'
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

export const createManuscript = async (
	request: FastifyRequest<{ Body: CreateManuscript }>,
	reply: FastifyReply,
): Promise<void> => {
	const { manuscriptsRepository, logger } = request.diScope.cradle

	const result = await manuscriptsRepository.createOne(request.body)

	if (result.isErr()) {
		logger.error(`Failed to create manuscript: ${result.error.message}`)

		return reply
			.status(result.error.code)
			.send({ message: result.error.message })
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

	const manuscript = await manuscriptsRepository.findById(id)

	const result = manuscript.toResult(new ManuscriptNotFoundError(id))

	if (result.isErr()) {
		logger.warn(`Manuscript with id '${id}' not found`)

		return reply
			.status(result.error.code)
			.send({ message: result.error.message })
	}

	await manuscriptsRepository.updateById(id, request.body)

	logger.info(`Manuscript with id '${id}' updated`)

	return reply.status(200).send({ ...result.value, ...request.body })
}

export const deleteManuscript = async (
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

	await manuscriptsRepository.deleteById(id)

	logger.info(`Manuscript with id '${id}' deleted`)

	return reply.status(204).send()
}
