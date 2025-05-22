import type { InvoiceStatus } from '#models/invoice'
import type User from '#models/user'
import type { SingleCustomer } from './customer.model'
import type { Meta } from './extra.model'

export interface SingleInvoice {
  id: string
  title: string
  notes: string
  invoiceNumber: string
  currency: string
  amount: number
  status: InvoiceStatus
  customerId: string
  userId: string
  customer: SingleCustomer
  user: User
  isRecurringInvoice: boolean
  isRecurringStartDate: string
  isRecurringEndDate: string
  isRecurringFrequency: string
  isDiscounted: boolean
  isDiscountedType: string
  isDiscountedValue: string
  dueDate: string
  createdAt: string
  updatedAt: string
  services: SingleService[]
}

export interface Invoices {
  data: SingleInvoice[]
  meta: Meta
}

export interface InvoiceStats {
  totalInvoices: number
  overdueInvoices: number
}

export interface SingleService {
  id: string
  name: string
  description: string
  quantity: string
  unitPrice: string
  totalPrice: string
}

export interface Services {
  data: SingleService[]
  meta: Meta
}
