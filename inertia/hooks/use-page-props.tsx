import type { SharedProps } from '@adonisjs/inertia/types'
import { usePage } from '@inertiajs/react'

export default function usePageProps<T>() {
  const page = usePage()

  return page.props as unknown as SharedProps & T
}
