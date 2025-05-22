import type * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'

import { cn } from '~/lib/utils'

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot='switch'
      className={cn(
        'peer data-[state=checked]:bg-main data-[state=unchecked]:bg-input  dark:data-[state=unchecked]:bg-input/80 inline-flex h-5 w-10  items-center rounded-full border border-transparent shadow-xs transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}>
      <SwitchPrimitive.Thumb
        data-slot='switch-thumb'
        className={cn(
          'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-[14px] rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-[4px]',
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
