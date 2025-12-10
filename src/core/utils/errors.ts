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

export { HttpError, NotFoundError }
