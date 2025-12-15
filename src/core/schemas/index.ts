import type { MultipartFile } from '@fastify/multipart'
import z, { ZodType } from 'zod'

const HealthCheckSchema = z
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

const FileSchema = z.object({
	id: z.uuidv7().describe('File unique identifier'),
	createdAt: z.coerce.date().describe('File creation date'),
	name: z.string().describe('File name'),
	mimeType: z.string().describe('File MIME type'),
	sizeInBytes: z.number().describe('File size in bytes'),
	uploadedBy: z.string().describe('ID of the member who uploaded the file'),
	manuscriptId: z.string().describe('ID of the manuscript the file belongs to'),
})

const HexSchema = z
	.custom<`#${string}`>((val) => {
		const regExp = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/

		return typeof val === 'string' && regExp.test(val)
	})
	.transform((val) => {
		if (val.length === 4) {
			return `#${val[1]}${val[1]}${val[2]}${val[2]}${val[3]}${val[3]}`.toUpperCase()
		}

		return val.toUpperCase()
	})
	.brand<'HexColor'>()

const CursorPaginationQuerySchema = z.object({
	cursor: z.string().optional().describe('Cursor for pagination'),
	limit: z.coerce
		.number()
		.int()
		.positive()
		.max(100)
		.default(20)
		.describe('Number of items to return'),
})

const CursorPaginationMetaSchema = z.object({
	nextCursor: z.string().nullable(),
	hasMore: z.boolean(),
})

const buildPaginatedSchema = (dataSchema: ZodType) => {
	return z.object({
		data: z.array(dataSchema),
		meta: CursorPaginationMetaSchema,
	})
}

export {
	buildPaginatedSchema,
	createFileSchema,
	CursorPaginationMetaSchema,
	CursorPaginationQuerySchema,
	FileSchema,
	HealthCheckSchema,
	HexSchema,
}
