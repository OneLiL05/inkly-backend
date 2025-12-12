import { DUPLICATE_KEY_ERR_CODE } from '@/core/constants/db.js'
import { EntityRepository } from '@/core/repositories/entity.repository.js'
import { InternalServerError, type HttpError } from '@/core/utils/errors.js'
import { tagTable } from '@/db/schema/tag.js'
import type { Tag } from '@/db/types.js'
import { and, eq, SQL } from 'drizzle-orm'
import postgres from 'postgres'
import { Err, None, Ok, type Result } from 'ts-results-es'
import { TagAlreadyExistsError } from '../errors/index.js'
import type { CreateTag, UpdateTag } from '../schemas/index.js'
import type {
	TagExistsInOrganizationArgs,
	TagsInjectableDependencies,
	TagsRepository,
} from '../types/index.js'
import { buildExistsQuery } from '@/core/utils/sql.js'

export class TagsRepositoryImpl
	extends EntityRepository<Tag, string>
	implements TagsRepository
{
	constructor({ db }: TagsInjectableDependencies) {
		super({ db: db.client, table: tagTable })
	}

	async existsInOrganization({
		tagId,
		organizationId,
	}: TagExistsInOrganizationArgs): Promise<boolean> {
		const rows = await this.db.execute<{ exists: boolean }>(
			buildExistsQuery({
				table: tagTable,
				condition: and(
					eq(tagTable.id, tagId),
					eq(tagTable.organizationId, organizationId),
				) as SQL,
			}),
		)

		return rows.at(0)?.exists ?? false
	}

	async createOne(data: CreateTag): Promise<Result<Tag, HttpError>> {
		try {
			const rows = await this.db.insert(tagTable).values(data).returning()

			const tag = rows[0]

			return Ok(tag!)
		} catch (e: unknown) {
			if (
				e instanceof Error &&
				e.cause instanceof postgres.PostgresError &&
				e.cause.code === DUPLICATE_KEY_ERR_CODE
			) {
				return Err(new TagAlreadyExistsError(data.name))
			}

			return Err(new InternalServerError())
		}
	}

	async updateById(
		id: string,
		data: UpdateTag,
	): Promise<Result<None, HttpError>> {
		try {
			await this.db.update(tagTable).set(data).where(eq(tagTable.id, id))

			return Ok(None)
		} catch {
			return Err(new InternalServerError())
		}
	}
}
