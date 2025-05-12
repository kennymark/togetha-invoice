import { useState, useCallback } from 'react'

interface UseDisclosureProps {
  defaultIsOpen?: boolean
}

interface UseDisclosureReturn {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onToggle: () => void
}

export function useDisclosure({
  defaultIsOpen = false,
}: UseDisclosureProps = {}): UseDisclosureReturn {
  const [isOpen, setIsOpen] = useState(defaultIsOpen)

  const onOpen = useCallback(() => {
    setIsOpen(true)
  }, [])

  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const onToggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
  }
}
