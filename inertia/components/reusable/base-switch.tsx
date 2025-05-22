import type * as React from 'react'
import { Switch } from '~/components/ui/switch'
import { cn } from '~/lib/utils'

interface BaseSwitchProps extends React.ComponentProps<typeof Switch> {
  leftText?: string
  rightText?: string
  className?: string
}

export function BaseSwitch({ leftText, rightText, className, ...props }: BaseSwitchProps) {
  return (
    <div className='flex items-center gap-2'>
      {leftText && (
        <span
          className={cn(
            'text-sm transition-colors font-semibold',
            props.checked ? 'text-muted-foreground' : 'text-foreground',
          )}>
          {leftText}
        </span>
      )}
      <Switch className={className} {...props} />
      {rightText && (
        <span
          className={cn(
            'text-sm transition-colors font-semibold',
            props.checked ? 'text-main' : 'text-muted-foreground',
          )}>
          {rightText}
        </span>
      )}
    </div>
  )
}
