import type { CommonDependencies, DatabaseClient } from '@/core/types/deps.js'
import { activityLogTable } from '@/db/schema/activity-log.js'
import type { Log } from '@/db/types.js'

export class ActivityLogRepository {
	private readonly db: DatabaseClient

	constructor({ db }: CommonDependencies) {
		this.db = db.client
	}

	async retirieveAll(): Promise<Log[]> {
		return this.db.select().from(activityLogTable)
	}
}
