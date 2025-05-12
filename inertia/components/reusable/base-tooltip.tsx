/**
 * A reusable tooltip component built on top of shadcn/ui Tooltip.
 * Provides a consistent way to display helpful information when hovering over elements.
 * Supports different positions, alignments, and customizable delay.
 *
 * @example
 * ```tsx
 * <BaseTooltip
 *   content="This is a helpful tooltip"
 *   side="top"
 *   align="center"
 *   delayDuration={500}
 * >
 *   <Button>Hover me</Button>
 * </BaseTooltip>
 * ```
 */
'use client'

import type React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

interface CustomTooltipProps {
  /** Content to display in the tooltip */
  content: React.ReactNode
  /** Element that triggers the tooltip on hover */
  children: React.ReactNode
  /** Position of the tooltip relative to the trigger element */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Horizontal alignment of the tooltip */
  align?: 'start' | 'center' | 'end'
  /** Delay in milliseconds before showing the tooltip */
  delayDuration?: number
  /** Additional CSS classes for the tooltip content */
  className?: string
}

/**
 * Base tooltip component that provides a consistent way to display helpful information.
 * The tooltip appears when hovering over the trigger element and supports various positioning options.
 */
function BaseTooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  delayDuration = 300,
  className,
}: CustomTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align} className={className}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default BaseTooltip
