import { useEffect } from 'react'
import useFlash from '../hooks/use-flash'
import { toast } from 'sonner'

type FlashType = {
  success?: { message: string }
  error?: { message: string }
  errors?: Record<string, string[]>
}

function FlashMessages() {
  const flash = useFlash() as FlashType

  useEffect(() => {
    if (!flash) return

    // Handle success message
    if (flash.success?.message) {
      console.log('success message', flash.success.message)
      toast.success(flash.success.message)
    }

    // Handle single error message
    if (flash.error?.message) {
      console.log('error message', flash.error.message)
      toast.error(flash.error.message)
    }

    // Handle validation errors
    if (flash.errors) {
      for (const [field, messages] of Object.entries(flash.errors)) {
        if (Array.isArray(messages)) {
          for (const message of messages) {
            toast.error(message, {
              description: field,
            })
          }
        }
      }
    }
  }, [flash])

  return null
}

export default FlashMessages
