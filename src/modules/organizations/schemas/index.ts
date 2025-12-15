import z from 'zod'

const GetOrganizationSchema = z.object({
	id: z.uuidv7().describe('The unique identifier of the organization'),
})

type GetOrganization = z.infer<typeof GetOrganizationSchema>

export { GetOrganizationSchema }
export type { GetOrganization }
