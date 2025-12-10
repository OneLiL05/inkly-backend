import type { Repository } from '@/core/types/common.js'
import type { BaseDiConfig, InjectableDependencies } from '@/core/types/deps.js'
import type { Manuscript } from '@/db/types.js'

interface ManuscriptsRepository extends Repository<Manuscript, string> {}

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
