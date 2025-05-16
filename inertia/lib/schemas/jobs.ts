import { z } from 'zod'

export const jobFormSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  customerId: z.string().min(1, 'Customer is required'),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['pending', 'completed', 'cancelled']),
  dueDate: z.date({
    required_error: 'Due date is required',
  }),
})

export type JobFormValues = z.infer<typeof jobFormSchema>
