import z from 'zod'

const ManuscriptModelSchema = z.object({
	id: z.uuidv7().describe('Unique identifier of the manuscript'),
	createdAt: z.date().describe('Creation timestamp of the manuscript'),
	updatedAt: z.date().describe('Last update timestamp of the manuscript'),
	deadlineAt: z.date().nullable().describe('Deadline of the manuscript'),
	name: z.string().min(5).max(100).describe('Name of the manuscript'),
	description: z.string().optional(),
	status: z.string(),
	publicationType: z.string(),
	organizationId: z.uuidv7(),
})

const GetManuscriptParamsSchema = z.object({
	id: z.uuidv7().describe('Identifier of the manuscript'),
})

const CreateManuscriptSchema = z.object({
	name: z.string().min(5).max(100),
	description: z.string().optional(),
	status: z.string(),
	publicationType: z.string(),
	deadlineAt: z.coerce.date(),
	organizationId: z.uuidv7(),
})

type CreateManuscript = z.infer<typeof CreateManuscriptSchema>
type GetManuscript = z.infer<typeof GetManuscriptParamsSchema>

export {
	CreateManuscriptSchema,
	GetManuscriptParamsSchema,
	ManuscriptModelSchema,
}
export type { CreateManuscript, GetManuscript }
