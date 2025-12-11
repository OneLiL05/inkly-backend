import type { DatabaseClient } from '@/core/types/deps.js'
import { PutObjectCommand, type S3Client } from '@aws-sdk/client-s3'
import type {
	FileUploadService,
	ManuscriptsInjectableDependencies,
	UploadFileArgs,
} from '../types/index.js'
import { fileTable } from '@/db/schema/file.js'

export class FileUploadServiceImpl implements FileUploadService {
	private readonly db: DatabaseClient
	private readonly s3: S3Client
	private readonly bucketName: string

	constructor({ db, s3, config }: ManuscriptsInjectableDependencies) {
		const { bucket } = config.s3

		this.db = db.client
		this.s3 = s3
		this.bucketName = bucket
	}

	async uploadFile({
		fileBuffer,
		fileName,
		mimeType,
		manuscriptId,
		uploadedBy,
	}: UploadFileArgs): Promise<void> {
		const name = `${Date.now()}-${fileName}`

		await Promise.all([
			this.s3.send(
				new PutObjectCommand({
					Bucket: this.bucketName,
					Key: name,
					Body: fileBuffer,
					ContentType: mimeType,
				}),
			),
			this.db.insert(fileTable).values({
				name,
				path: this.getFileUrl(name),
				uploadedBy,
				mimeType,
				manuscriptId,
				sizeInBytes: fileBuffer.length,
			}),
		])
	}

	private getFileUrl(key: string): string {
		return `https://${this.bucketName}.s3.${this.s3.config.region}.amazonaws.com/${key}`
	}
}
