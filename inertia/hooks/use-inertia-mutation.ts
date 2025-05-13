import type { APIRoutes } from '#extensions/routes-types'
import { router } from '@inertiajs/react'
import { useCallback, useState } from 'react'

interface UseInertiaMutationProps {
  url: APIRoutes[Uppercase<UseInertiaMutationProps['method']>]
  method: 'post' | 'put' | 'delete'
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
  withInertia?: boolean
}

function useInertiaMutation({ url, method, onSuccess, onError, withInertia = true }: UseInertiaMutationProps) {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const mutate = useCallback(async (requestData?: any) => {
    router.visit(`/${url}`, {
      method,
      data: requestData,
      headers: {
        'X-Inertia': withInertia ? 'true' : 'false',
      },
      onSuccess: (response) => {
        setData(response as any)
        onSuccess?.(response)
      },
      onError: (error) => {
        setError(error as any)
        onError?.(error)
      },
      onStart: () => setIsPending(true),
      onFinish: () => setIsPending(false),
    })
  }, [])

  return { mutate, isPending, error, data }
}

export default useInertiaMutation

// Usage example:
