import { usePage } from '@inertiajs/react'
import { useState, useEffect } from 'react'

export type FlashMessage = {
  type: 'success' | 'error'
  message: string
}

export type FlashValidationErrors = {
  [key: string]: string[]
}

export type Flash = {
  success?: { message: string }
  error?: { message: string } | FlashValidationErrors
}

export default function useFlash() {
  const { props } = usePage()
  const [flash, setFlash] = useState<Flash | null>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (props.flash) {
      setFlash(props.flash as Flash)
      setVisible(true)
    }
  }, [props.flash])

  const dismiss = () => {
    setVisible(false)
  }

  return { flash, visible, dismiss }
}
