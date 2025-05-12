import { RawUser } from '#interfaces/model_types'
import { usePage } from '@inertiajs/react'

interface UseAuth {
  user: RawUser
  isDemo: boolean
  isAuthenticated: boolean
  isPropertySeeker: boolean
  isOwnerAgent: boolean
}
function useAuth(): UseAuth {
  const { user, isDemo } = usePage().props as unknown as {
    user: RawUser
    isDemo: boolean
  }

  const isPropertySeeker = user?.role === 'property_seeker'
  const isOwnerAgent = user?.role === 'owner_agent'

  return { user, isDemo, isAuthenticated: !!user, isPropertySeeker, isOwnerAgent }
}

export default useAuth
