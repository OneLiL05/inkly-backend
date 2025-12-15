import type { FastifyReply, FastifyRequest } from 'fastify'
import { fromNodeHeaders } from 'better-auth/node'
import { UnauthorizedError } from '@/core/utils/errors.js'
import { ManuscriptNotFoundError } from '@/modules/manuscripts/errors/index.js'
import {
	CommentNotFoundError,
	ParentCommentNotFoundError,
} from '../errors/index.js'
import type {
	CreateComment,
	GetCommentParams,
	GetManuscriptCommentsParams,
	GetManuscriptCommentsQuery,
	CreateReplyParams,
	UpdateComment,
} from '../schemas/index.js'

export const getManuscriptComments = async (
	request: FastifyRequest<{
		Params: GetManuscriptCommentsParams
		Querystring: GetManuscriptCommentsQuery
	}>,
	reply: FastifyReply,
): Promise<void> => {
	const { manuscriptId } = request.params
	const { cursor, limit = 20 } = request.query
	const { commentsRepository, manuscriptsRepository, logger } =
		request.diScope.cradle

	const manuscriptExists = await manuscriptsRepository.existsById(manuscriptId)
	if (!manuscriptExists) {
		const error = new ManuscriptNotFoundError(manuscriptId)
		logger.warn(`Manuscript ${manuscriptId} not found`)
		return reply.status(error.code).send(error.toObject())
	}

	const paginatedComments = await commentsRepository.findByManuscript({
		manuscriptId,
		pagination: { cursor, limit },
	})

	return reply.status(200).send(paginatedComments)
}

export const getComment = async (
	request: FastifyRequest<{ Params: GetCommentParams }>,
	reply: FastifyReply,
): Promise<void> => {
	const { id } = request.params
	const { commentsRepository, logger } = request.diScope.cradle

	const commentOption = await commentsRepository.findByIdWithAuthor(id)

	const result = commentOption.toResult(new CommentNotFoundError(id))

	if (result.isErr()) {
		logger.warn(`Comment ${id} not found`)
		return reply.status(result.error.code).send(result.error.toObject())
	}

	return reply.status(200).send(result.value)
}

export const createComment = async (
	request: FastifyRequest<{
		Params: GetManuscriptCommentsParams
		Body: CreateComment
	}>,
	reply: FastifyReply,
): Promise<void> => {
	const { manuscriptId } = request.params
	const { text } = request.body
	const { commentsRepository, manuscriptsRepository, auth, logger } =
		request.diScope.cradle

	const activeMember = await auth.api.getActiveMember({
		headers: fromNodeHeaders(request.headers),
	})

	if (!activeMember) {
		const error = new UnauthorizedError()

		return reply.status(error.code).send(error.toObject())
	}

	const manuscriptExists = await manuscriptsRepository.existsById(manuscriptId)

	if (!manuscriptExists) {
		const error = new ManuscriptNotFoundError(manuscriptId)
		return reply.status(error.code).send(error.toObject())
	}

	const result = await commentsRepository.createOne({
		text,
		manuscriptId,
		authorId: activeMember.id,
		parentId: null,
	})

	if (result.isErr()) {
		logger.error(`Failed to create comment: ${result.error.message}`)
		return reply.status(result.error.code).send(result.error.toObject())
	}

	logger.info(
		`Comment created on manuscript ${manuscriptId} by member ${activeMember.id}`,
	)

	return reply.status(201).send(result.value)
}

export const createReply = async (
	request: FastifyRequest<{
		Params: CreateReplyParams
		Body: CreateComment
	}>,
	reply: FastifyReply,
): Promise<void> => {
	const { manuscriptId, commentId } = request.params
	const { text } = request.body
	const { commentsRepository, manuscriptsRepository, auth, logger } =
		request.diScope.cradle

	const activeMember = await auth.api.getActiveMember({
		headers: fromNodeHeaders(request.headers),
	})

	if (!activeMember) {
		const error = new UnauthorizedError()
		return reply.status(error.code).send(error.toObject())
	}

	const manuscriptExists = await manuscriptsRepository.existsById(manuscriptId)

	if (!manuscriptExists) {
		const error = new ManuscriptNotFoundError(manuscriptId)

		return reply.status(error.code).send(error.toObject())
	}

	const parentExists = await commentsRepository.existsById(commentId)

	if (!parentExists) {
		const error = new ParentCommentNotFoundError(commentId)

		return reply.status(error.code).send(error.toObject())
	}

	const result = await commentsRepository.createOne({
		text,
		manuscriptId,
		authorId: activeMember.id,
		parentId: commentId,
	})

	if (result.isErr()) {
		logger.error(`Failed to create reply: ${result.error.message}`)

		return reply.status(result.error.code).send(result.error.toObject())
	}

	logger.info(
		`Reply created on comment ${commentId} by member ${activeMember.id}`,
	)

	return reply.status(201).send(result.value)
}

export const updateComment = async (
	request: FastifyRequest<{
		Params: GetCommentParams
		Body: UpdateComment
	}>,
	reply: FastifyReply,
): Promise<void> => {
	const { id } = request.params

	const { commentsRepository, logger } = request.diScope.cradle

	const result = await commentsRepository.updateById(id, request.body)

	if (result.isErr()) {
		logger.error(`Failed to update comment ${id}`)
		return reply.status(result.error.code).send(result.error.toObject())
	}

	logger.info(`Comment ${id} updated`)

	return reply.status(204).send()
}

export const deleteComment = async (
	request: FastifyRequest<{ Params: GetCommentParams }>,
	reply: FastifyReply,
): Promise<void> => {
	const { id } = request.params
	const { commentsRepository, logger } = request.diScope.cradle

	await commentsRepository.deleteById(id)

	logger.info(`Comment ${id} deleted`)

	return reply.status(204).send()
}
