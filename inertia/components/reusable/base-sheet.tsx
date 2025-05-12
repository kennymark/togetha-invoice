/**
 * A reusable sheet component built on top of shadcn/ui Sheet.
 * Provides a flexible way to display content in a sliding panel with various customization options.
 * Supports different sizes, positions, navigation, and footer content.
 *
 * @example
 * ```tsx
 * <BaseSheet
 *   trigger={<Button>Open Sheet</Button>}
 *   title="Sheet Title"
 *   description="Sheet description"
 *   side="right"
 *   size="md"
 *   hasNav
 *   hasFooter
 *   footerContent={<Button>Close</Button>}
 * >
 *   <div>Sheet content goes here</div>
 * </BaseSheet>
 * ```
 */
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from '~/components/ui/sheet'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/lib/utils'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { useState } from 'react'

import clsx from 'clsx'

/** Available sheet size options */
const SHEET_SIZES = {
  /** Default size (fit content) */
  default: 'max-w-fit',
  /** Small size (384px max width) */
  sm: 'sm:max-w-sm',
  /** Medium size (448px max width) */
  md: 'sm:max-w-md',
  /** Large size (512px max width) */
  lg: 'sm:max-w-lg',
  /** Extra large size (576px max width) */
  xl: 'sm:max-w-xl',
  /** Full size (100% width and height) */
  full: 'max-w-full h-full sm:overflow-y-auto',
} as const

/** Sheet variant styles using class-variance-authority */
const sheetVariants = cva('gap-10 border-none', {
  variants: {
    size: SHEET_SIZES,
  },
  defaultVariants: {
    size: 'md',
  },
})

type SheetVariantProps = VariantProps<typeof sheetVariants>

interface CustomSheetProps extends SheetVariantProps {
  /** Controlled open state */
  open?: boolean
  /** Callback when sheet state changes */
  setOpen?: (open: boolean) => void
  /** Position of the sheet relative to the viewport */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Trigger element that opens the sheet */
  trigger?: ReactNode
  /** Additional CSS classes for the trigger */
  triggerClassName?: string
  /** Sheet title */
  title: string
  /** Sheet description */
  description?: string
  /** Sheet content */
  children: ReactNode
  /** Additional CSS classes for the content */
  contentClassName?: string
  /** Whether to show the navigation bar */
  hasNav?: boolean
  /** Navigation bar content */
  navChildren?: ReactNode
  /** Whether to show the footer */
  hasFooter?: boolean
  /** Footer content */
  footerContent?: ReactNode
  /** Function to call when closing the sheet */
  closeFunction?: () => void
}

/**
 * Base sheet component that provides a consistent way to display content in a sliding panel.
 * Supports various customization options including size, position, navigation, and footer.
 */
export default function BaseSheet({
  open = false,
  hasFooter = false,
  footerContent,
  setOpen,
  side = 'right',
  size = 'md',
  title,
  description,
  trigger,
  triggerClassName = '',
  contentClassName = '',
  children,
  hasNav = false,
  navChildren,
}: CustomSheetProps) {
  const [internalOpen, setInternalOpen] = useState<boolean>(false)

  const handleOpenChange = (open: boolean) => {
    setInternalOpen(open)
    setOpen?.(open)
  }

  return (
    <Sheet open={open ? open : internalOpen} onOpenChange={handleOpenChange}>
      {trigger && <SheetTrigger className={triggerClassName}>{trigger}</SheetTrigger>}
      <SheetContent
        side={side}
        className={cn(
          contentClassName,
          sheetVariants({ size }),
          `${hasNav ? '[&>button]:hidden scrollbar-none' : ''}`,
        )}>
        {hasNav && <SheetNav>{navChildren}</SheetNav>}

        <SheetHeader className='w-full flex flex-col items-center justify-center font-input-mono sr-only'>
          <SheetTitle className='text-2xl'>{title}</SheetTitle>
          <SheetDescription className='text-lg'>{description}</SheetDescription>
        </SheetHeader>

        {children}

        {hasFooter && <SheetFooter className='mt-auto pt-4'>{footerContent || null}</SheetFooter>}
      </SheetContent>
    </Sheet>
  )
}

/**
 * Navigation component for the sheet that provides a consistent header with close button.
 * Supports custom content and close functionality.
 */
function SheetNav({
  children,
  closeFunction,
}: {
  /** Navigation content */
  children: ReactNode
  /** Function to call when closing the sheet */
  closeFunction?: CustomSheetProps['closeFunction']
}) {
  return (
    <nav
      className={clsx(
        'max-w-[var(--max-width)] w-full flex items-center px-[1rem] md:px-[2rem] fixed top-0  backdrop-blur-sm',
        {
          'justify-end py-3 bg-transparent': !children,
          'bg-white/10 justify-between': children,
        },
      )}>
      {children}
      <SheetClose onClick={closeFunction} className='p-2 hover:bg-white/10 rounded-lg w-6 h-6 '>
        <X />
      </SheetClose>
    </nav>
  )
}
