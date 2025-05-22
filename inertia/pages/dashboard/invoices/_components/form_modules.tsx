import { FormField, BaseSelect, BaseSwitch } from '~/components/reusable'
import { Input, DatePicker, Button } from '~/components/ui'
import { OnlyShowIf } from '~/components/conditionals'
import type { UseFormReturn } from 'react-hook-form'
import type { InvoiceFormValues } from '~/lib/schemas/invoice'
import { PlusIcon, Trash2Icon } from 'lucide-react'
import { formatCurrency } from '~/utils/format'
import { handleServiceQuantityChange, handleServiceUnitPriceChange } from './helpers'

const currencyOptions = [
  { value: 'gbp', label: 'GBP (£)' },
  { value: 'usd', label: 'USD ($)' },
  { value: 'eur', label: 'EUR (€)' },
]

const getCurrencyDisplay = (currency: string) => currency.toUpperCase()

interface CustomerSelectProps {
  form: UseFormReturn<InvoiceFormValues>
  customers: Array<{ id: string; fullName: string; email: string }>
}

export function CustomerSelect({ form, customers }: CustomerSelectProps) {
  return (
    <FormField form={form} name='customerId' label='Customer' showError>
      <BaseSelect
        placeholder='Select customer'
        items={customers.map((customer) => ({
          label: `${customer.fullName} - ${customer.email}`,
          value: customer.id,
        }))}
        onChange={(value) => form.setValue('customerId', value)}
        value={form.watch('customerId')}
      />
    </FormField>
  )
}

interface BasicDetailsProps {
  form: UseFormReturn<InvoiceFormValues>
}

export function BasicDetails({ form }: BasicDetailsProps) {
  const currency = form.watch('currency')
  const dueDate = form.watch('dueDate')

  const handleDateChange = (date: string | undefined) => {
    if (date) {
      form.setValue('dueDate', date)
    }
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5'>
      <FormField form={form} name='invoiceNumber' label='Invoice #' showMessage>
        <Input placeholder='INV-001' />
      </FormField>

      <FormField form={form} name='title' label='Invoice title' showMessage className='col-span-2'>
        <Input placeholder='Invoice title' />
      </FormField>

      <FormField form={form} name='currency' label='Receive payment in:' showMessage>
        <BaseSelect
          placeholder='Select currency'
          items={currencyOptions}
          onChange={(value) => form.setValue('currency', value as 'gbp' | 'usd' | 'eur')}
          value={currency}
        />
      </FormField>
      <FormField form={form} name='dueDate' label='Due Date' showMessage>
        <DatePicker date={dueDate} onSelect={handleDateChange} placeholder='Select due date' />
      </FormField>
    </div>
  )
}

interface RecurringInvoiceProps {
  form: UseFormReturn<InvoiceFormValues>
}

export function RecurringInvoice({ form }: RecurringInvoiceProps) {
  const isRecurringInvoice = form.watch('isRecurringInvoice')
  const isRecurringStartDate = form.watch('isRecurringStartDate')
  const isRecurringEndDate = form.watch('isRecurringEndDate')

  const handleDateChange =
    (field: 'isRecurringStartDate' | 'isRecurringEndDate') => (date: string | undefined) => {
      if (date) {
        form.setValue(field, date)
      }
    }

  return (
    <>
      <FormField
        form={form}
        name='isRecurringInvoice'
        label='Make this a reoccurring invoice'
        showMessage>
        {(field) => (
          <BaseSwitch
            leftText='No'
            rightText='Yes'
            checked={isRecurringInvoice}
            onCheckedChange={field.onChange}
          />
        )}
      </FormField>

      <OnlyShowIf condition={isRecurringInvoice}>
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
          <FormField form={form} name='isRecurringStartDate' label='Start date' showMessage>
            <DatePicker
              date={isRecurringStartDate}
              onSelect={handleDateChange('isRecurringStartDate')}
              placeholder='Select start date'
            />
          </FormField>
          <FormField form={form} name='isRecurringFrequency' label='Frequency' showError>
            <BaseSelect
              placeholder='Select frequency'
              items={[
                { label: 'Daily', value: 'daily' },
                { label: 'Weekly', value: 'weekly' },
                { label: 'Monthly', value: 'monthly' },
                { label: 'Yearly', value: 'yearly' },
              ]}
              onChange={(value) =>
                form.setValue(
                  'isRecurringFrequency',
                  value as 'daily' | 'weekly' | 'monthly' | 'yearly',
                )
              }
              value={form.watch('isRecurringFrequency')}
            />
          </FormField>

          <FormField form={form} name='isRecurringEndDate' label='End date' showMessage>
            <DatePicker
              date={isRecurringEndDate}
              onSelect={handleDateChange('isRecurringEndDate')}
            />
          </FormField>
        </div>
      </OnlyShowIf>
    </>
  )
}

interface DiscountProps {
  form: UseFormReturn<InvoiceFormValues>
}

export function Discount({ form }: DiscountProps) {
  const isDiscounted = form.watch('isDiscounted')
  const isDiscountedType = form.watch('isDiscountedType')

  const currency = form.watch('currency')

  const getDiscountDisplay = () => {
    if (!isDiscounted) return null
    return isDiscountedType === 'percentage' ? '% off' : getCurrencyDisplay(currency)
  }

  return (
    <>
      <FormField form={form} name='isDiscounted' label='Are you offering a discount?' showMessage>
        {(field) => (
          <BaseSwitch
            leftText='No'
            rightText='Yes'
            checked={isDiscounted}
            onCheckedChange={field.onChange}
          />
        )}
      </FormField>

      <OnlyShowIf condition={isDiscounted}>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <FormField form={form} name='isDiscountedType' label='Discount type' showMessage>
            <BaseSelect
              placeholder='Select discount type'
              items={[
                { label: 'Amount', value: 'amount' },
                { label: 'Percentage', value: 'percentage' },
              ]}
            />
          </FormField>
          <FormField form={form} name='isDiscountedValue' label='Discount value' showMessage>
            {(field) => (
              <div className='relative w-full'>
                <Input
                  type='number'
                  min={0}
                  step={0.01}
                  placeholder='0.00'
                  value={field.value === 0 ? '' : (field.value as number)}
                  onChange={(e) => {
                    const value = e.target.value === '' ? '' : Number(e.target.value)
                    field.onChange(value)
                  }}
                />
                <span className='absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500'>
                  {getDiscountDisplay()}
                </span>
              </div>
            )}
          </FormField>
        </div>
      </OnlyShowIf>
    </>
  )
}

interface NotesProps {
  form: UseFormReturn<InvoiceFormValues>
}

export function Notes({ form }: NotesProps) {
  return (
    <FormField form={form} name='notes' label='Additional notes' showMessage>
      <Input
        placeholder='Add any additional notes or payment instructions'
        className='min-h-[100px]'
      />
    </FormField>
  )
}

interface ServiceItemProps {
  form: UseFormReturn<InvoiceFormValues>
  index: number
  currency: string
  onRemove: () => void
  showRemove: boolean
}

export function ServiceItem({ form, index, currency, onRemove, showRemove }: ServiceItemProps) {
  return (
    <div className='grid grid-cols-12 gap-4 items-start'>
      <div className='col-span-5 flex items-center justify-center gap-4'>
        <span className='text-sm font-medium w-fit'>{index + 1}</span>
        <FormField
          form={form}
          name={`services.${index}.name`}
          label='Service name'
          showMessage
          className='w-full'>
          <Input
            placeholder='Item description'
            onChange={(e) => {
              form.setValue(`services.${index}.name`, e.target.value, {
                shouldValidate: true,
              })
            }}
          />
        </FormField>
      </div>

      <FormField
        form={form}
        name={`services.${index}.quantity`}
        label='Quantity'
        showMessage
        className='col-span-2'>
        {(field) => (
          <Input
            type='number'
            min={1}
            placeholder='1'
            onChange={(e) => {
              const value = e.target.value === '' ? '' : Number(e.target.value)
              field.onChange(value)
              handleServiceQuantityChange(form, index, value === '' ? 0 : value)
            }}
            value={field.value === 0 ? '' : (field.value as number)}
          />
        )}
      </FormField>

      <FormField
        form={form}
        name={`services.${index}.unitPrice`}
        label='Unit price'
        showMessage
        className='col-span-2'>
        {(field) => (
          <div className='relative'>
            <Input
              type='number'
              min={0}
              step={0.01}
              placeholder='0.00'
              onChange={(e) => {
                const value = e.target.value === '' ? '' : Number(e.target.value)
                field.onChange(value)
                handleServiceUnitPriceChange(form, index, value === '' ? 0 : value)
              }}
              value={field.value === 0 ? '' : (field.value as number)}
            />
            <span className='absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500'>
              {getCurrencyDisplay(currency)}
            </span>
          </div>
        )}
      </FormField>

      <div className='col-span-2 flex items-center gap-2 justify-end'>
        <div className='flex flex-col items-end'>
          <span className=' text-sm font-medium block mb-2'>Total</span>
          <div className='text-base font-medium'>
            {formatCurrency(form.watch(`services.${index}.totalPrice`), currency)}
          </div>
        </div>
      </div>
      <div className='col-span-1'>
        {showRemove && (
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='h-8 w-8 text-gray-500 hover:text-red-500 mt-6'
            onClick={onRemove}>
            <Trash2Icon className='h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  )
}

interface ServiceListProps {
  form: UseFormReturn<InvoiceFormValues>
  onAddService: () => void
  onRemoveService: (index: number) => void
}

export function ServiceList({ form, onAddService, onRemoveService }: ServiceListProps) {
  const services = form.watch('services')
  const currency = form.watch('currency')

  return (
    <div className='space-y-4'>
      {services?.map((_, index) => (
        <ServiceItem
          key={`${index}-${services?.length}`}
          form={form}
          index={index}
          currency={currency}
          onRemove={() => onRemoveService(index)}
          showRemove={services.length > 1}
        />
      ))}

      <Button type='button' variant='outline' onClick={onAddService}>
        <PlusIcon className='w-4 h-4 mr-2' /> Add another item
      </Button>
    </div>
  )
}

interface InvoiceSummaryProps {
  form: UseFormReturn<InvoiceFormValues>
  subtotal: number
  total: number
}

export function InvoiceSummary({ form, subtotal, total }: InvoiceSummaryProps) {
  const currency = form.watch('currency')
  const isDiscounted = form.watch('isDiscounted')
  const isDiscountedType = form.watch('isDiscountedType')
  const isDiscountedValue = form.watch('isDiscountedValue')

  const getDiscountDisplay = () => {
    if (!isDiscounted) return null
    return isDiscountedType === 'percentage' ? '% off' : getCurrencyDisplay(currency)
  }

  return (
    <div className='space-y-2 mt-6'>
      <div className='flex justify-between items-center text-sm font-medium text-gray-600'>
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal, currency)}</span>
      </div>
      <OnlyShowIf condition={isDiscounted}>
        <div className='flex justify-between items-center text-sm font-medium text-gray-600'>
          <span>Discount</span>
          <span>
            {isDiscountedValue}
            {getDiscountDisplay()}
          </span>
        </div>
      </OnlyShowIf>
      <div className='flex justify-between items-center text-base font-semibold border-t border-b border-gray-200 py-3 mt-2'>
        <span>Total</span>
        <span>{formatCurrency(total, currency)}</span>
      </div>
    </div>
  )
}
