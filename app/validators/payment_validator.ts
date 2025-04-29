import vine from '@vinejs/vine'

export const createPaymentValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(255),
    description: vine.string().maxLength(255),
    amount: vine.number().min(0),
    currencyCode: vine.string().maxLength(3),
  }),
)

export const updatePaymentValidator = vine.compile(
  vine.object({
    title: vine.string().maxLength(255).optional(),
    description: vine.string().maxLength(255).optional(),
    amount: vine.number().min(0).optional(),
    currencyCode: vine.string().maxLength(3).optional(),
    status: vine.enum(['paid', 'pending', 'failed', 'refunded']).optional(),
    paymentProvider: vine.string().optional(),
    paymentMethod: vine.string().optional(),
    paymentUrl: vine.string().optional(),
    paymentDate: vine.date().optional(),
  }),
)
