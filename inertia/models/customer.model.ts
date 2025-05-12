import type { Meta } from '~/models/extra.model'

export interface SingleCustomer {
  id: string
  userId: string
  fullName: string
  email: string
  phone: string
  address: string
  postCode: string
  state: string
  city: string
  country: string
  businessName: string
  businessAddress: string
  createdAt: Date
  updatedAt: Date
}

export interface Customers {
  data: SingleCustomer[]
  meta: Meta
}

export interface CustomerStats {
  totalCustomers: number
}
