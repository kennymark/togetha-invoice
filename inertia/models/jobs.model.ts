import type { JobPriority, JobStatus } from '#models/job'
import type User from '#models/user'
import type { SingleCustomer } from './customer.model'
import type { Meta } from './extra.model'

export interface SingleJob {
  id: string
  title: string
  description: string
  category: string
  customerId: string
  userId: string
  images: string[]
  customer: SingleCustomer
  user: User
  priority: JobPriority
  status: JobStatus
  dueDate: string
  createdAt: string
  updatedAt: string
}

export interface Jobs {
  data: SingleJob[]
  meta: Meta
}

export interface JobStats {
  pendingJobs: number
  completedJobs: number
}
