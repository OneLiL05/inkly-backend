import { EntityRepository } from '@/core/repositories/entity.repository.js'
import { manuscriptTable } from '@/db/schema/manuscript.js'
import type { Manuscript } from '@/db/types.js'
import type {
	ManuscriptsInjectableDependencies,
	ManuscriptsRepository,
} from '../types/index.js'

export class ManuscriptsRepositoryImpl
	extends EntityRepository<Manuscript, string>
	implements ManuscriptsRepository
{
	constructor({ db }: ManuscriptsInjectableDependencies) {
		super({ db: db.client, table: manuscriptTable })
	}
}
