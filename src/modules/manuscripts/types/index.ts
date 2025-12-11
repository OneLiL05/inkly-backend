import type { Repository } from '@/core/types/common.js'
import type { BaseDiConfig, InjectableDependencies } from '@/core/types/deps.js'
import type { HttpError } from '@/core/utils/errors.js'
import type { Manuscript } from '@/db/types.js'
import type { Result } from 'ts-results-es'
import type { CreateManuscript, UpdateManuscript } from '../schemas/index.js'

interface UploadFileArgs {
	fileBuffer: Buffer
	fileName: string
	mimeType: string
	uploadedBy: string
	manuscriptId: string
}

interface ManuscriptsRepository extends Repository<Manuscript, string> {
	createOne(data: CreateManuscript): Promise<Result<Manuscript, HttpError>>
	updateById: (id: string, data: UpdateManuscript) => Promise<void>
}

interface FileUploadService {
	uploadFile: (args: UploadFileArgs) => Promise<void>
}

interface ManuscriptsModuleDependencies {
	manuscriptsRepository: ManuscriptsRepository
	fileUploadService: FileUploadService
}

type ManuscriptsInjectableDependencies =
	InjectableDependencies<ManuscriptsModuleDependencies>

type ManuscriptsDiConfig = BaseDiConfig<ManuscriptsModuleDependencies>

export type {
	FileUploadService,
	ManuscriptsDiConfig,
	ManuscriptsInjectableDependencies,
	ManuscriptsModuleDependencies,
	ManuscriptsRepository,
	UploadFileArgs,
}
