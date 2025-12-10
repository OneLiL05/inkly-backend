import { NotFoundError } from '@/core/utils/errors.js'

export class ManuscriptNotFoundError extends NotFoundError {
	constructor(id: string) {
		super(`Manuscript with id '${id}' not found`)
	}
}
