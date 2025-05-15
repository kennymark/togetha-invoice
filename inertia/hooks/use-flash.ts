import type { SharedProps } from '@adonisjs/inertia/types'
import usePageProps from './use-page-props'

function useFlash() {
  const props = usePageProps<SharedProps>()

  return props.session?.flashMessages
}

export default useFlash
