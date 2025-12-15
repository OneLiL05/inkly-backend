import { checkPermissions } from '@/core/middlewares/check-permissions.middleware.js'
import { isAuthorized } from '@/core/middlewares/is-authorized.middleware.js'
import { generateFailedHttpResponse } from '@/core/utils/schemas.js'
import { ManuscriptModelSchema } from '@/modules/manuscripts/schemas/index.js'
import { TagSchema } from '@/modules/tags/schemas/index.js'
import z from 'zod'
import {
	getOrganizationManuscripts,
	getOrganizationTags,
} from '../handlers/index.js'

export const getOrganizationRoutes = () => ({
	routes: [
		{
			method: 'GET',
			url: '/organizations/:id/manuscripts',
			handler: getOrganizationManuscripts,
			preHandler: [isAuthorized, checkPermissions({ manuscript: ['read'] })],
			schema: {
				summary: 'Get all Manuscripts in an Organization',
				description:
					'Retrieve all manuscripts associated with the organization',
				tags: ['Organizations'],
				response: {
					200: z
						.array(ManuscriptModelSchema)
						.describe('List of manuscripts in the organization'),
					401: generateFailedHttpResponse(401).describe(
						'User is not authenticated',
					),
					403: generateFailedHttpResponse(403).describe(
						'User is not authorized to view manuscripts',
					),
					404: generateFailedHttpResponse(404).describe(
						'Organization not found',
					),
				},
			},
		},
		{
			method: 'GET',
			url: '/organizations/:id/tags',
			handler: getOrganizationTags,
			preHandler: [isAuthorized, checkPermissions({ tag: ['read'] })],
			schema: {
				summary: 'Get all Tags in an Organization',
				description: 'Retrieve all tags associated with the organization',
				tags: ['Organizations'],
				response: {
					200: z.array(TagSchema).describe('List of tags in the organization'),
					401: generateFailedHttpResponse(401).describe(
						'User is not authenticated',
					),
					403: generateFailedHttpResponse(403).describe(
						'User is not authorized to view tags',
					),
				},
			},
		},
	],
})
