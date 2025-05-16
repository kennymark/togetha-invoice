import vine from '@vinejs/vine'

export const createJobValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(255),
    description: vine.string().maxLength(255),
    customerId: vine.string(),
    category: vine.string(),
    status: vine.enum(['pending', 'completed', 'cancelled']),
    priority: vine.enum(['low', 'medium', 'high']),
    dueDate: vine.string(),
  }),
)

export const updateJobValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(255).optional(),
    description: vine.string().maxLength(255).optional(),
    customerId: vine.string().optional(),
    category: vine.string().optional(),
    status: vine.enum(['pending', 'completed', 'cancelled']).optional(),
    priority: vine.enum(['low', 'medium', 'high']).optional(),
    dueDate: vine.string().optional(),
  }),
)
