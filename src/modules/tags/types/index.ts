import type { Repository } from '@/core/types/common.js'
import type { BaseDiConfig, InjectableDependencies } from '@/core/types/deps.js'
import type { HttpError } from '@/core/utils/errors.js'
import type { Tag } from '@/db/types.js'
import type { None, Result } from 'ts-results-es'
import type { CreateTag, UpdateTag } from '../schemas/index.js'

interface TagExistsInOrganizationArgs {
	tagId: string
	organizationId: string
}
interface TagsRepository extends Repository<Tag, string> {
	existsInOrganization: (args: TagExistsInOrganizationArgs) => Promise<boolean>
	createOne: (data: CreateTag) => Promise<Result<Tag, HttpError>>
	updateById: (id: string, data: UpdateTag) => Promise<Result<None, HttpError>>
}

interface TagsModuleDependencies {
	tagsRepository: TagsRepository
}

type TagsInjectableDependencies = InjectableDependencies<TagsModuleDependencies>

type TagsDiConfig = BaseDiConfig<TagsModuleDependencies>

export type {
	TagsRepository,
	TagsModuleDependencies,
	TagsInjectableDependencies,
	TagsDiConfig,
	TagExistsInOrganizationArgs,
}
