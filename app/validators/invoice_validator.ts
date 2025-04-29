import vine from '@vinejs/vine'

export const createInvoiceValidator = vine.compile(
  vine.object({
    customerId: vine.string(),
    title: vine.string(),
    invoiceNumber: vine.string(),
    currency: vine.string(),
    dueDate: vine.date(),
    amount: vine.number(),
    status: vine.enum(['pending', 'paid', 'overdue']),
    isRecurringInvoice: vine.boolean(),
    isRecurringStartDate: vine.date(),
    isRecurringEndDate: vine.date(),
    isRecurringFrequency: vine.string(),
    isDiscounted: vine.boolean(),
    isDiscountedAmount: vine.number(),
    isDiscountedPercentage: vine.number(),
    notes: vine.string(),
    services: vine.array(
      vine.object({
        name: vine.string(),
        description: vine.string(),
        quantity: vine.number(),
        unitPrice: vine.number(),
        totalPrice: vine.number(),
      }),
    ),
  }),
)

export const updateInvoiceValidator = vine.compile(
  vine.object({
    customerId: vine.string().optional(),
    title: vine.string().optional(),
    invoiceNumber: vine.string().optional(),
    currency: vine.string().optional(),
    dueDate: vine.date().optional(),
    amount: vine.number().optional(),
    status: vine.enum(['pending', 'paid', 'overdue']).optional(),
    isRecurringInvoice: vine.boolean().optional(),
    isRecurringStartDate: vine.date().optional(),
    isRecurringEndDate: vine.date().optional(),
    isRecurringFrequency: vine.string().optional(),
    isDiscounted: vine.boolean().optional(),
    isDiscountedAmount: vine.number().optional(),
    isDiscountedPercentage: vine.number().optional(),
    notes: vine.string().optional(),
  }),
)
