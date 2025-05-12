import { z } from 'zod'

export const paymentFormSchema = z.object({
  serviceTitle: z
    .string()
    .min(1, 'Service title is required')
    .max(100, 'Service title must not exceed 100 characters'),
  description: z.string().optional(),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Please enter a valid amount'),
  currency: z.string().min(1, 'Currency is required'),
})

export type PaymentFormValues = z.infer<typeof paymentFormSchema>
