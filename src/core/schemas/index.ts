import type { MultipartFile } from '@fastify/multipart'
import z from 'zod'

const HEALTH_CHECK_SCHEMA = z
	.object({
		uptime: z.number().positive().describe('Uptime in seconds'),
		message: z.string().describe('Health check message'),
		date: z.date().describe('Health check date'),
	})
	.describe('Health check response')

const createFileSchema = (options: {
	maxSize?: number
	allowedMimeTypes: string[]
}) => {
	let schema = z.custom<MultipartFile>(
		(val) => val && typeof val === 'object' && 'toBuffer' in val,
		{ message: 'Invalid file upload' },
	)

	if (options?.maxSize) {
		const maxSize = options.maxSize

		schema = schema.refine(
			async (file) => {
				const buffer = await file.toBuffer()

				return buffer.length <= maxSize
			},
			{ error: `File size must be less than ${maxSize} bytes` },
		)
	}

	if (options.allowedMimeTypes) {
		const allowedMimeTypes = options.allowedMimeTypes

		schema = schema.refine(
			(file) => {
				return allowedMimeTypes.includes(file.mimetype)
			},
			{ error: `Allowed types: ${options.allowedMimeTypes.join(', ')}` },
		)
	}
	return schema
}

export { HEALTH_CHECK_SCHEMA, createFileSchema }
