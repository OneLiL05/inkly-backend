import type { Routes } from '@/core/types/routes.js'
import {
	generateFailedHttpResponse,
	generateFailedValidationResponse,
} from '@/core/utils/schemas.js'
import {
	createManuscript,
	deleteManuscript,
	getManuscript,
	updateManuscript,
} from '../handlers/index.js'
import {
	CreateManuscriptSchema,
	GetManuscriptParamsSchema,
	ManuscriptModelSchema,
	UpdateManuscriptSchema,
} from '../schemas/index.js'

export const getManuscriptsRoutes = (): Routes => ({
	routes: [
		{
			method: 'POST',
			url: '/manuscripts',
			handler: createManuscript,
			schema: {
				summary: 'Create a new Manuscript',
				description: 'Create a new manuscript for a particular organization',
				tags: ['Manuscripts'],
				body: CreateManuscriptSchema,
				response: {
					201: ManuscriptModelSchema.describe(
						'Manuscript created successfully',
					),
					400: generateFailedValidationResponse().describe(
						'Request body does not match schema',
					),
					409: generateFailedHttpResponse(409).describe(
						'Manuscript with such name already exists in the organization',
					),
					500: generateFailedHttpResponse(500).describe(
						'Internal server error while creating manuscript',
					),
				},
			},
		},
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
		{
			method: 'PUT',
			url: '/manuscripts/:id',
			handler: updateManuscript,
			schema: {
				summary: 'Update Manuscript by ID',
				description: 'Update a manuscript by its ID',
				tags: ['Manuscripts'],
				params: GetManuscriptParamsSchema,
				body: CreateManuscriptSchema.partial(),
				response: {
					200: ManuscriptModelSchema.describe(
						'Manuscript updated successfully',
					),
					400: generateFailedValidationResponse().describe(
						"ID parameter or request body doesn't match schema",
					),
					404: generateFailedHttpResponse(404).describe('Manuscript not found'),
				},
			},
		},
		{
			method: 'DELETE',
			url: '/manuscripts/:id',
			handler: deleteManuscript,
			schema: {
				summary: 'Delete Manuscript by ID',
				description: 'Delete a manuscript by its ID',
				tags: ['Manuscripts'],
				params: GetManuscriptParamsSchema,
				body: UpdateManuscriptSchema,
				response: {
					204: {
						description: 'Manuscript deleted successfully',
					},
					400: generateFailedValidationResponse().describe(
						"ID parameter doesn't match schema",
					),
					404: generateFailedHttpResponse(404).describe('Manuscript not found'),
				},
			},
		},
	],
})
