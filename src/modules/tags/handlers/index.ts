import type { FastifyReply, FastifyRequest } from 'fastify'
import type { CreateTag, GetTag, UpdateTag } from '../schemas/index.js'
import { TagNotFoundError } from '../errors/index.js'
import type { GetOrganization } from '@/modules/organizations/schemas/index.js'

export const getOrganizationTags = async (
	request: FastifyRequest<{ Params: GetOrganization }>,
	reply: FastifyReply,
): Promise<void> => {
	const { id } = request.params
	const { tagsRepository } = request.diScope.cradle

	const tags = await tagsRepository.findAllByOrganization(id)

	return reply.status(200).send(tags)
}

export const createTag = async (
	request: FastifyRequest<{ Body: CreateTag }>,
	reply: FastifyReply,
): Promise<void> => {
	const { tagsRepository, logger } = request.diScope.cradle

	const result = await tagsRepository.createOne(request.body)

	if (result.isErr()) {
		logger.error(`Error creating tag: ${result.error.message}`)

		return reply.status(result.error.code).send(result.error.toObject())
	}

	return reply.status(201).send(result.value)
}

export const updateTag = async (
	request: FastifyRequest<{ Params: GetTag; Body: UpdateTag }>,
	reply: FastifyReply,
): Promise<void> => {
	const { tagId, organizationId } = request.params
	const { tagsRepository, logger } = request.diScope.cradle

	const exists = await tagsRepository.existsInOrganization({
		tagId,
		organizationId,
	})

	if (!exists) {
		logger.warn(
			`Tag with id '${tagId}' not found for update in organization '${organizationId}'`,
		)

		const error = new TagNotFoundError(tagId)

		return reply.status(error.code).send(error.toObject())
	}

	const result = await tagsRepository.updateById(tagId, request.body)

	if (result.isErr()) {
		logger.error(`Error updating tag: ${result.error.message}`)

		return reply.status(result.error.code).send(result.error.toObject())
	}

	return reply.status(204).send()
}

export const deleteTag = async (
	request: FastifyRequest<{ Params: GetTag }>,
	reply: FastifyReply,
): Promise<void> => {
	const { tagId, organizationId } = request.params
	const { tagsRepository, logger } = request.diScope.cradle

	const exists = await tagsRepository.existsInOrganization({
		tagId,
		organizationId,
	})

	if (!exists) {
		logger.warn(
			`Tag with id '${tagId}' not found for deletion in organization '${organizationId}'`,
		)

		const error = new TagNotFoundError(tagId)

		return reply.status(error.code).send(error.toObject())
	}

	await tagsRepository.deleteById(tagId)

	return reply.status(204).send()
}
