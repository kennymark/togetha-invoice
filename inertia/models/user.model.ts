import type { ModelObject } from './extra.model'

export interface UserData {
  id: string
  email: string
  fullName: string
  is2FaEnabled: boolean
  isActive: boolean
  metadata: ModelObject | null
  secondaryEmail: string | null
  contactNumber: string
  status: string
  createdAt: string
  updatedAt: string
}
