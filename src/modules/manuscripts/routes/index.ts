import type { Routes } from '@/core/types/routes.js'
import { getManuscript } from '../handlers/index.js'
import {
	GetManuscriptParamsSchema,
	ManuscriptModelSchema,
} from '../schemas/index.js'
import {
	generateFailedHttpResponse,
	generateFailedValidationResponse,
} from '@/core/utils/schemas.js'

export const getManuscriptsRoutes = (): Routes => ({
	routes: [
		{
			method: 'GET',
			url: '/manuscripts/:id',
			handler: getManuscript,
			schema: {
				summary: 'Get Manuscript by ID',
				description: 'Retrieve a manuscript by its ID',
				tags: ['Manuscripts'],
				params: GetManuscriptParamsSchema,
				response: {
					200: ManuscriptModelSchema.describe(
						'Manuscript retrieved successfully',
					),
					400: generateFailedValidationResponse().describe(
						"ID parameter doesn't match schema",
					),
					404: generateFailedHttpResponse(404).describe('Manuscript not found'),
				},
			},
		},
	],
})
