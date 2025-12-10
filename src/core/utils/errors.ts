class HttpError extends Error {
	code: number

	constructor(code: number, message: string) {
		super(message)
		this.code = code
		this.name = 'HTTP_ERROR'
	}
}

class NotFoundError extends HttpError {
	constructor(message: string) {
		super(404, message)
		this.name = 'NOT_FOUND_ERROR'
	}
}

class ConflictError extends HttpError {
	constructor(message: string) {
		super(409, message)
		this.name = 'CONFLICT_ERROR'
	}
}

class InternalServerError extends HttpError {
	constructor() {
		super(500, 'An unexpected error occurred on the server')
		this.name = 'INTERNAL_SERVER_ERROR'
	}
}

export { HttpError, NotFoundError, InternalServerError, ConflictError }
