import { Calendar } from 'lucide-react'
import { BaseSelect } from './base-select'
import type { ICustomSelectProps } from './base-select'

interface TimeSelectorProps extends Omit<ICustomSelectProps, 'triggerClassName'> {
  className?: string
}

export function TimeSelector({ items, value, ...props }: TimeSelectorProps) {
  return (
    <BaseSelect
      {...props}
      value={value}
      items={items}
      triggerClassName='rounded-[20px] border-gray-200 bg-white px-4 py-2 hover:bg-gray-50'
      removeChevron
      selectedItemRenderer={(currentValue) => (
        <div className='flex items-center gap-2 w-full'>
          <Calendar className='size-4 text-gray-500' />
          <span className='text-sm font-medium'>
            {items.find((item) => item.value === currentValue)?.label || props.placeholder}
          </span>
        </div>
      )}
    />
  )
}
