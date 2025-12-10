import type {
	CommonDependencies,
	ExternalDependencies,
} from '@/core/types/deps.js'
import { resolveAuthModule } from '@/modules/auth/index.js'
import type { AuthModuleDependencies } from '@/modules/auth/types/index.js'
import type { AwilixContainer, NameAndRegistrationPair } from 'awilix'
import { resolveCommonDiConfig } from './common-di-config.js'
import type { ManuscriptsModuleDependencies } from '@/modules/manuscripts/types/index.js'
import { resolveManuscriptsModule } from '@/modules/manuscripts/index.js'

type Dependencies = CommonDependencies &
	AuthModuleDependencies &
	ManuscriptsModuleDependencies

type DiConfig = NameAndRegistrationPair<Dependencies>

export const registerDependencies = (
	diContainer: AwilixContainer,
	dependencies: ExternalDependencies,
) => {
	const diConfig: DiConfig = {
		...resolveCommonDiConfig(dependencies),
		...resolveAuthModule(),
		...resolveManuscriptsModule(),
	}

	diContainer.register(diConfig)
}

declare module '@fastify/awilix' {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface Cradle extends Dependencies {}

	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface RequestCradle extends Dependencies {}
}
