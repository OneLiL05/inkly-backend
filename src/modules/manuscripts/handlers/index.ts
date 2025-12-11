import type { FastifyReply, FastifyRequest } from 'fastify'
import { ManuscriptNotFoundError } from '../errors/index.js'
import {
	type CreateManuscript,
	type GetManuscript,
	type UpdateManuscript,
} from '../schemas/index.js'
import { createFileSchema } from '@/core/schemas/index.js'
import { DOCUMENT_MIME_TYPES } from '../constants/index.js'
import { fromNodeHeaders } from 'better-auth/node'
import { PermissionsError } from '@/core/utils/errors.js'

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

export const updloadManuscriptFile = async (
	request: FastifyRequest<{ Params: GetManuscript }>,
	reply: FastifyReply,
): Promise<void> => {
	const { id } = request.params
	const { logger, auth, fileUploadService } = request.diScope.cradle

	const file = await request.file()

	const documentSchema = createFileSchema({
		allowedMimeTypes: DOCUMENT_MIME_TYPES,
	})

	const result = documentSchema.safeParse(file)

	if (!result.success) {
		return reply.status(400).send({
			status: 400,
			error: 'Request Validation Error',
			message: 'Uploaded file is invalid',
			details: {
				issues: result.error.issues,
				method: request.method,
				url: request.url,
			},
		})
	}

	logger.info(file?.filename)

	const activeMember = await auth.api.getActiveMember({
		headers: fromNodeHeaders(request.headers),
	})

	if (!activeMember) {
		const error = new PermissionsError()

		return reply.status(error.code).send(error.toObject())
	}

	const fileBuffer = await result.data.toBuffer()

	try {
		await fileUploadService.uploadFile({
			fileBuffer: fileBuffer,
			fileName: result.data.filename || 'untitled',
			uploadedBy: activeMember.id,
			mimeType: result.data.mimetype,
			manuscriptId: id,
		})
	} catch (e: unknown) {
		logger.error(
			`Failed to upload file for manuscript '${id}': ${e instanceof Error ? e.message : String(e)}`,
		)
		return reply.status(500).send({
			status: 500,
			error: 'Internal Server Error',
			message: 'Failed to upload manuscript file',
		})
	}

	return reply.status(204).send()
}
