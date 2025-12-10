import type { Repository } from '@/core/types/common.js'
import type { BaseDiConfig, InjectableDependencies } from '@/core/types/deps.js'
import type { Manuscript } from '@/db/types.js'
import type { CreateManuscript, UpdateManuscript } from '../schemas/index.js'
import type { Result } from 'ts-results-es'
import type { HttpError } from '@/core/utils/errors.js'

interface ManuscriptsRepository extends Repository<Manuscript, string> {
	createOne(data: CreateManuscript): Promise<Result<Manuscript, HttpError>>
	updateById: (id: string, data: UpdateManuscript) => Promise<void>
}

interface ManuscriptsModuleDependencies {
	manuscriptsRepository: ManuscriptsRepository
}

type ManuscriptsInjectableDependencies =
	InjectableDependencies<ManuscriptsModuleDependencies>

type ManuscriptsDiConfig = BaseDiConfig<ManuscriptsModuleDependencies>

export type {
	ManuscriptsRepository,
	ManuscriptsModuleDependencies,
	ManuscriptsInjectableDependencies,
	ManuscriptsDiConfig,
}
