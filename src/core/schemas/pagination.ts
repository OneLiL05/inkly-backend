import z, { ZodType } from 'zod'

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
	CursorPaginationMetaSchema,
	CursorPaginationQuerySchema,
}
