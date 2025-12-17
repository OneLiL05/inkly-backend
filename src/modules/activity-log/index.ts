import { asFunction } from 'awilix'
import type { ActivityLogDiConfig } from './types/index.js'
import type { CommonDependencies } from '@/core/types/deps.js'
import { createActivityLog } from './utilities/index.js'

export const resolveActivityLogModule = (): ActivityLogDiConfig => ({
	activityLog: asFunction((deps: CommonDependencies) => {
		return createActivityLog(deps)
	}),
})
