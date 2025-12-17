import type { Entity } from '@/core/constants/entities.js'
import type { BaseDiConfig } from '@/core/types/deps.js'
import type { ActivityAction, LogSeverity } from '../constants/index.js'

interface LogData {
	entity: Entity
	severity: LogSeverity
	description: string
	performedBy: string
}

type ActivityLog = {
	[K in ActivityAction as `log${Capitalize<K>}`]: (
		data: LogData,
	) => Promise<void>
}

interface ActivityLogModuleDependencies {
	activityLog: ActivityLog
}

type ActivityLogDiConfig = BaseDiConfig<ActivityLogModuleDependencies>

export type {
	ActivityLogDiConfig,
	ActivityLogModuleDependencies,
	ActivityLog,
	LogData,
}
