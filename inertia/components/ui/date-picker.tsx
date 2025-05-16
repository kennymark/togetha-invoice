import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '~/lib/utils'
import { Button } from './button'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

interface DatePickerProps {
  date?: Date
  onSelect?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
}

export function DatePicker({
  date,
  onSelect,
  placeholder = 'Pick a date',
  disabled,
}: DatePickerProps) {
  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Create a new date object to avoid mutating the original
      const newDate = new Date(selectedDate)
      // Set time to noon to avoid timezone issues
      newDate.setHours(12, 0, 0, 0)
      // Format as ISO string to ensure proper datetime format
      const isoDate = newDate.toISOString()
      // Convert back to Date object
      onSelect?.(new Date(isoDate))
    } else {
      onSelect?.(undefined)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'w-full justify-start text-left font-normal rounded-[6px]',
            !date && 'text-muted-foreground',
          )}
          disabled={disabled}>
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? format(date, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={handleSelect}
          disabled={(date) => disabled || date < new Date(new Date().setHours(0, 0, 0, 0))}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
