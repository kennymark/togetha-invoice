/**
 * A reusable dialog component built on top of shadcn/ui AlertDialog.
 * Provides a consistent way to display confirmation dialogs with customizable content and actions.
 *
 * @example
 * ```tsx
 * <BaseDialog
 *   trigger={<Button>Delete Item</Button>}
 *   title="Delete Confirmation"
 *   description="Are you sure you want to delete this item? This action cannot be undone."
 *   confirmText="Delete"
 *   cancelText="Cancel"
 *   actionVariant="destructive"
 *   onConfirm={() => handleDelete()}
 * />
 * ```
 */
'use client'

import { useState } from 'react'
import type { ButtonProps } from '../ui/button'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '../ui/alert-dialog'

interface CustomDialogProps {
  /** The trigger element that opens the dialog (usually a button) */
  trigger: React.ReactNode
  /** The title displayed in the dialog header */
  title: string
  /** The description text displayed in the dialog body */
  description: string
  /** Text for the confirm button (default: 'Confirm') */
  confirmText?: string
  /** Text for the cancel button (default: 'Cancel') */
  cancelText?: string
  /** Variant of the confirm button (inherits from ButtonProps) */
  actionVariant?: ButtonProps['variant']
  /** Callback function executed when the confirm button is clicked */
  onConfirm: () => void
}

function BaseDialog({
  trigger,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  actionVariant = 'secondary',
}: CustomDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleConfirm = () => {
    onConfirm()
    setIsOpen(false)
  }

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsOpen(true)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild onClick={handleTriggerClick}>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className='w-[90%] rounded-md border-[#FFFFFF14]'>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} variant={actionVariant}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default BaseDialog
