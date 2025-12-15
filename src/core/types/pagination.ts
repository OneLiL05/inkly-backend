interface CursorPaginationMeta {
	nextCursor: string | null
	hasMore: boolean
}

interface CursorPaginationOptions {
	cursor?: string | null
	limit: number
}

interface Paginated<T extends object> {
	data: T[]
	meta: CursorPaginationMeta
}

type FindPaginatedArgs<T extends object> = T & {
	pagination: CursorPaginationOptions
}

export type {
	CursorPaginationMeta,
	CursorPaginationOptions,
	FindPaginatedArgs,
	Paginated,
}
