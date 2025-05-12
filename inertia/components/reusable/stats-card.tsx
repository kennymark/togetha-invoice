import type { ReactNode } from 'react'
import { Card, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui'

interface StatsCardProps {
  icon: ReactNode
  label: string
  value: string | number
  description?: string
  action?: () => void
  actionText?: string
}

/**
 * StatsCard displays a dashboard statistic with icon, label, value, and optional description/action.
 */
function StatsCard({
  icon,
  label,
  value,
  description,
  action,
  actionText = 'View',
}: StatsCardProps) {
  return (
    <Card className='flex flex-row items-center gap-4 px-8 py-7 min-w-[260px] shadow-none'>
      <div className='flex items-center justify-center w-10 h-10 rounded-full bg-[#CCE7E5]'>
        {icon}
      </div>
      <CardContent className='flex-1 px-0 py-0 flex flex-col gap-1'>
        <div className='flex items-center justify-between'>
          <span className=' text-sm font-medium'>{label}</span>
          {action && (
            <span>
              <Button
                type='button'
                onClick={action}
                variant='action'
                size='sm'
                className='rounded-full'>
                {actionText}
              </Button>
            </span>
          )}
        </div>
        <div className='flex gap-1 items-end'>
          <span className='text-2xl font-semibold '>{value}</span>
          {description && <span className='text-xs text-[#6D747A] font-normal'>{description}</span>}
        </div>
      </CardContent>
    </Card>
  )
}

export { StatsCard }
