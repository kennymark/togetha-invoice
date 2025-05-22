import vine from '@vinejs/vine'

export const createInvoiceValidator = vine.compile(
  vine.object({
    customerId: vine.string(),
    title: vine.string(),
    invoiceNumber: vine.string(),
    amount: vine.number(),
    currency: vine.string(),
    dueDate: vine.string(),
    isRecurringInvoice: vine.boolean(),
    isRecurringStartDate: vine.string(),
    isRecurringEndDate: vine.string(),
    isRecurringFrequency: vine.string(),
    isDiscounted: vine.boolean(),
    isDiscountedType: vine.enum(['amount', 'percentage']),
    isDiscountedValue: vine.number(),
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
    dueDate: vine.string().optional(),
    amount: vine.number().optional(),
    status: vine.enum(['pending', 'paid', 'overdue']).optional(),
    isRecurringInvoice: vine.boolean().optional(),
    isRecurringStartDate: vine.string().optional(),
    isRecurringEndDate: vine.string().optional(),
    isRecurringFrequency: vine.string().optional(),
    isDiscounted: vine.boolean().optional(),
    isDiscountedType: vine.enum(['amount', 'percentage']).optional(),
    isDiscountedValue: vine.number().optional(),
    notes: vine.string().optional(),
    services: vine.array(
      vine.object({
        id: vine.string(),
        name: vine.string(),
        description: vine.string(),
        quantity: vine.number(),
        unitPrice: vine.number(),
        totalPrice: vine.number(),
      }),
    ),
  }),
)
