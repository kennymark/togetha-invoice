import vine from '@vinejs/vine'
import type { Infer } from '@vinejs/vine/types'
export type QueryParams = Infer<typeof queryParamsSchema>

export const queryParamsSchema = vine.compile(
  vine.object({
    page: vine.number().optional(),
    perPage: vine.number().optional(),
    search: vine.string().optional(),
    startDate: vine.string().optional(),
    endDate: vine.string().optional(),
    sortBy: vine.string().optional(),
    sortOrder: vine.enum(['asc', 'desc']).optional(),
    archived: vine.boolean().optional(),
    id: vine.string().optional(),
    paymentStatus: vine.enum(['paid', 'pending', 'failed', 'refunded']).optional(),
  }),
)

export const validateQueryParams = async (queryParams: Record<string, string>) => {
  return queryParamsSchema.validate(queryParams) as Promise<Required<QueryParams>>
}
