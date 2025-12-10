import { EntityRepository } from '@/core/repositories/entity.repository.js'
import { manuscriptTable } from '@/db/schema/manuscript.js'
import type { Manuscript } from '@/db/types.js'
import type {
	ManuscriptsInjectableDependencies,
	ManuscriptsRepository,
} from '../types/index.js'
import { Err, Ok, type Result } from 'ts-results-es'
import {
	ConflictError,
	InternalServerError,
	type HttpError,
} from '@/core/utils/errors.js'
import type { CreateManuscript, UpdateManuscript } from '../schemas/index.js'
import postgres from 'postgres'
import { DUPLICATE_KEY_ERR_CODE } from '@/core/constants/db.js'
import { eq } from 'drizzle-orm'

export class ManuscriptsRepositoryImpl
	extends EntityRepository<Manuscript, string>
	implements ManuscriptsRepository
{
	constructor({ db }: ManuscriptsInjectableDependencies) {
		super({ db: db.client, table: manuscriptTable })
	}

	async createOne(
		data: CreateManuscript,
	): Promise<Result<Manuscript, HttpError>> {
		try {
			const rows = await this.db
				.insert(manuscriptTable)
				.values(data)
				.returning()

			return Ok(rows.at(0) as Manuscript)
		} catch (error: unknown) {
			if (
				error instanceof Error &&
				error.cause instanceof postgres.PostgresError &&
				error.cause.code === DUPLICATE_KEY_ERR_CODE
			) {
				return Err(
					new ConflictError('Manuscript with the same name already exists'),
				)
			}

			return Err(new InternalServerError())
		}
	}

	async updateById(id: string, data: UpdateManuscript): Promise<void> {
		await this.db
			.update(manuscriptTable)
			.set(data)
			.where(eq(manuscriptTable.id, id))
	}
}
