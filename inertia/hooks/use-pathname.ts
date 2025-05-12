import { usePage } from '@inertiajs/react'

function usePathname(): string {
  const pathname = usePage().url

  return pathname
}

export default usePathname
