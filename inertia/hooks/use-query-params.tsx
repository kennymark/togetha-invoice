// import type { SharedProps } from '@adonisjs/inertia/types'
import type { SharedProps } from '@adonisjs/inertia/types'
import { router, usePage } from '@inertiajs/react'

function useQueryParams<T = Record<string, string>>(): SharedProps['qs'] & T {
  const page = usePage()
  return page.props.qs as SharedProps['qs'] & T
}

export function updateQueryParams(params: Record<string, string>) {
  const currentUrl = window.location.pathname
  router.get(currentUrl, params)
}

export default useQueryParams
