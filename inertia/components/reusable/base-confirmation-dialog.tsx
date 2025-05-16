import type * as React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { cn } from '~/lib/utils'

interface ConfirmationDialogProps {
  trigger?: React.ReactNode
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel?: () => void
  variant?: 'default' | 'destructive'
  className?: string
  isOpen?: boolean
  onToggle?: (open: boolean) => void
}

export function ConfirmationDialog({
  trigger,
  title,
  description,
  confirmText = 'Continue',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  className,
  isOpen,
  onToggle,
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onToggle?.(false)
  }

  const handleCancel = () => {
    onCancel?.()
    onToggle?.(false)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onToggle}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent className={cn('sm:max-w-[425px]', className)}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={cn(variant === 'destructive' && 'bg-destructive hover:bg-destructive/90')}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
