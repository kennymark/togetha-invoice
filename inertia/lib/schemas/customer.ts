import { z } from 'zod'

export const customerFormSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must not exceed 15 digits')
    .regex(/^[+]?[\d\s-]+$/, 'Please enter a valid phone number'),
  businessName: z.string().optional(),
  businessAddress: z.string().optional(),
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must not exceed 200 characters'),
  state: z.string(),
  postCode: z
    .string()
    .min(3, 'Post code must be at least 3 characters')
    .max(10, 'Post code must not exceed 10 characters'),
  city: z.string().min(1, 'Please select a city'),
  country: z.string().min(1, 'Please select a country'),
})

export type CustomerFormValues = z.infer<typeof customerFormSchema>
