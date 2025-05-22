import { z } from 'zod'

export const invoiceFormSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  title: z.string().min(1, 'Title is required'),
  customerId: z.string().min(1, 'Customer is required'),
  currency: z.enum(['gbp', 'usd', 'eur']),
  amount: z.number().min(0, 'Total must be positive'),
  dueDate: z.string(),
  isRecurringInvoice: z.boolean(),
  isRecurringStartDate: z.string(),
  isRecurringEndDate: z.string(),
  isRecurringFrequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  isDiscounted: z.boolean(),
  isDiscountedType: z.enum(['amount', 'percentage']),
  isDiscountedValue: z.number(),
  services: z
    .array(
      z.object({
        name: z.string().min(1, 'Item name is required'),
        description: z.string().min(1, 'Item description is required'),
        quantity: z.number().min(1, 'Quantity must be at least 1'),
        unitPrice: z.number().min(0, 'Unit price must be positive'),
        totalPrice: z.number().min(0, 'Total price must be positive'),
      }),
    )
    .min(1, 'At least one item is required'),
  notes: z.string(),
})

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>
