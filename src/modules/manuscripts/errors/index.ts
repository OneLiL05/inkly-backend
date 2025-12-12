import { NotFoundError } from '@/core/utils/errors.js'
import type { FindFileArgs } from '../types/index.js'

export class ManuscriptNotFoundError extends NotFoundError {
	constructor(id: string) {
		super(`Manuscript with id '${id}' not found`)
	}
}

export class FileNotFoundError extends NotFoundError {
	constructor({ fileId, manuscriptId }: FindFileArgs) {
		super(
			`File with id '${fileId}' for manuscript with id '${manuscriptId}' not found`,
		)
	}
}
