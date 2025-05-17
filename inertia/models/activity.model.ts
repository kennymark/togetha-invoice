import type { Meta } from '~/models/extra.model'

export interface SingleActivity {
  id: string
  userId: string
  summary: string
  type: string
  createdAt: Date
  customer?: {
    id: string
    fullName: string
  }
  job?: {
    id: string
    title: string
  }
  invoice?: {
    id: string
    title: string
    amount: number
  }
}

export interface Activities {
  data: SingleActivity[]
  meta: Meta
}

export interface ActivityStats {
  totalEarnings: number
  activeJobs: number
  unpaidInvoices: number
}
