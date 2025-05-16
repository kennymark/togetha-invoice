import { useEffect } from 'react'
import useFlash from '../hooks/use-flash'
import { toast } from 'sonner'

type ValidationError = {
  field: string
  message: string
  rule: string
}

type FlashType = {
  success?: { message: string }
  error?: { message: string }
  errors?: Record<string, string[]> | ValidationError[]
}

const formatFieldName = (field: string): string => {
  // Convert camelCase to spaces and capitalize first letter
  return field
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .trim()
}

const formatMessage = (message: string, field: string): string => {
  // Replace field references with formatted field name
  const formattedField = formatFieldName(field)
  return message
    .replace(new RegExp(field, 'g'), formattedField)
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
}

function FlashMessages() {
  const flash = useFlash() as FlashType

  useEffect(() => {
    console.log('FlashMessages mounted/updated')
    console.log('Flash state:', JSON.stringify(flash, null, 2))

    if (!flash) return

    // Handle success message
    if (flash.success?.message) {
      console.log('Showing success message:', flash.success.message)
      toast.success(flash.success.message)
    }

    // Handle validation errors first
    if (flash.errors) {
      console.log('Processing validation errors:', JSON.stringify(flash.errors, null, 2))
      // Handle array of validation errors
      if (Array.isArray(flash.errors)) {
        for (const error of flash.errors) {
          console.log('Showing validation error:', error)
          toast.error(formatMessage(error.message, error.field), {
            description: formatFieldName(error.field),
          })
        }
      }
      // Handle record of validation errors
      else {
        for (const [field, messages] of Object.entries(flash.errors)) {
          if (Array.isArray(messages)) {
            for (const message of messages) {
              console.log('Showing validation error:', { field, message })
              toast.error(formatMessage(message, field), {
                description: formatFieldName(field),
              })
            }
          }
        }
      }
    }
    // Only show single error message if there are no validation errors
    else if (flash.error?.message) {
      console.log('Showing single error message:', flash.error.message)
      toast.error(flash.error.message)
    }
  }, [flash])

  return null
}

export default FlashMessages
