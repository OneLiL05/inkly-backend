import type { FastifyReply, FastifyRequest } from 'fastify'
import type { GetOrganization } from '../schemas/index.js'
import { OrganizationNotFoundError } from '../errors/index.js'

export const getOrganizationManuscripts = async (
	request: FastifyRequest<{ Params: GetOrganization }>,
	reply: FastifyReply,
): Promise<void> => {
	const { id } = request.params
	const { manuscriptsRepository, organizationsRepository, logger } =
		request.diScope.cradle

	const exists = await organizationsRepository.existsById(id)

	if (!exists) {
		const error = new OrganizationNotFoundError(id)

		logger.warn(error.message)

		return reply.status(404).send(error.toObject())
	}

	const manuscripts = await manuscriptsRepository.findAllByOrganization(id)

	return reply.status(200).send(manuscripts)
}

export const getOrganizationTags = async (
	request: FastifyRequest<{ Params: GetOrganization }>,
	reply: FastifyReply,
): Promise<void> => {
	const { id } = request.params
	const { tagsRepository, organizationsRepository, logger } =
		request.diScope.cradle

	const exists = await organizationsRepository.existsById(id)

	if (!exists) {
		const error = new OrganizationNotFoundError(id)

		logger.warn(error.message)

		return reply.status(404).send(error.toObject())
	}

	const tags = await tagsRepository.findAllByOrganization(id)

	return reply.status(200).send(tags)
}
