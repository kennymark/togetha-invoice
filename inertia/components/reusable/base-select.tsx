/**
 * A reusable select component built on top of shadcn/ui Select.
 * Provides a flexible way to create dropdown select inputs.
 *
 * @example
 * ```tsx
 * <BaseSelect
 *   placeholder="Select an option"
 *   items={[
 *     { value: "1", label: "Option 1" },
 *     { value: "2", label: "Option 2" }
 *   ]}
 *   label="Options"
 *   onChange={(value) => console.log(value)}
 * />
 * ```
 */
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '~/components/ui/select'
import { cn } from '~/lib/utils'
import type * as React from 'react'

export interface ICustomSelectProps {
  /** Default selected value */
  defaultValue?: string
  /** Placeholder text when no value is selected */
  placeholder: string
  /** Array of selectable items */
  items: { value: string; label: string }[]
  /** Controlled selected value */
  value?: string
  /** Callback when selection changes */
  onChange?: (value: string) => void
  /** Custom renderer for the selected item */
  selectedItemRenderer?: (value: string) => React.ReactNode
  /** Custom options to replace default items */
  customOptions?: React.ReactNode
  /** Label text for the select group */
  label?: string
  /** Whether to show loading state */
  isLoading?: boolean
  /** Additional CSS classes for the trigger element */
  triggerClassName?: string
  /** Additional CSS classes for the content element */
  contentClassName?: string
  /** Additional CSS classes for the item elements */
  itemClassName?: string
  /** Whether to remove the chevron icon */
  removeChevron?: boolean
}

/**
 * Base select component that provides a consistent way to create dropdown select inputs.
 */
export function BaseSelect({
  defaultValue,
  placeholder,
  items,
  value,
  onChange,
  selectedItemRenderer,
  customOptions,
  label,
  isLoading = false,
  triggerClassName,
  contentClassName,
  itemClassName,
  removeChevron = false,
}: ICustomSelectProps) {
  const safeItems = Array.isArray(items)
    ? items.filter((item) => item && typeof item === 'object' && 'value' in item && 'label' in item)
    : []

  if (isLoading) {
    return (
      <div
        className={cn(
          'h-10 w-full rounded-[6px] border border-input bg-background animate-pulse',
          triggerClassName,
        )}
      />
    )
  }

  return (
    <Select value={value} onValueChange={onChange} defaultValue={defaultValue}>
      <SelectTrigger className={cn('w-full', triggerClassName)} removeChevron={removeChevron}>
        {selectedItemRenderer ? (
          <SelectValue placeholder={placeholder} className='w-full'>
            {value && selectedItemRenderer(value)}
          </SelectValue>
        ) : (
          <SelectValue placeholder={placeholder} />
        )}
      </SelectTrigger>
      <SelectContent className={contentClassName}>
        <SelectGroup>
          {label && <SelectLabel>{label}</SelectLabel>}
          {customOptions
            ? customOptions
            : safeItems.map((item) => (
                <SelectItem key={item.value} value={item.value} className={itemClassName}>
                  {item.label}
                </SelectItem>
              ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
