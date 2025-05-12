import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormBase, FormBaseHeader, FormField, BaseSelect } from '~/components/reusable'
import { Input, Button, Textarea, DatePicker } from '~/components/ui'
import { SEO } from '~/components/seo'
import { PageHeader } from '../../_components/page-header'
import { z } from 'zod'

const invoiceFormSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  customer: z.string().min(1, 'Customer is required'),
  currency: z.string().min(1, 'Currency is required'),
  dueDate: z.date({
    required_error: 'Due date is required',
  }),
  items: z
    .array(
      z.object({
        description: z.string().min(1, 'Item description is required'),
        quantity: z.number().min(1, 'Quantity must be at least 1'),
        unitPrice: z.number().min(0, 'Unit price must be positive'),
      }),
    )
    .min(1, 'At least one item is required'),
  notes: z.string().optional(),
})

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>

const currencyOptions = [
  { value: 'gbp', label: 'GBP (£)' },
  { value: 'usd', label: 'USD ($)' },
  { value: 'eur', label: 'EUR (€)' },
]

const customerOptions = [
  { value: 'tolu@togetha.co.uk', label: 'Tolu - tolulope@togetha.co.uk' },
  // Add more customers as needed
]

export default function InvoicesCreatePage() {
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      invoiceNumber: '',
      customer: '',
      currency: 'gbp',
      dueDate: new Date(),
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
      notes: '',
    },
  })

  function handleSubmit(data: InvoiceFormValues) {
    console.log('invoice data', data)
    // TODO: Implement submission logic
    // e.g., call API, show notification, etc.
  }

  return (
    <>
      <SEO title='Create Invoice' description='Create a new invoice for your customers' />
      <PageHeader title='Create Invoice' description='Generate professional invoices in seconds' />
      <div className='flex flex-col gap-8 w-full'>
        <FormBase form={form} onSubmit={handleSubmit} className='space-y-7'>
          <FormBaseHeader title='Invoice details' />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <FormField form={form} name='invoiceNumber' label='Invoice number' showMessage>
              <Input placeholder='INV-001' />
            </FormField>

            <FormField form={form} name='customer' label='Select customer' showMessage>
              <BaseSelect
                placeholder='Select a customer'
                items={customerOptions}
                onChange={(value) => form.setValue('customer', value)}
                value={form.watch('customer')}
              />
            </FormField>

            <FormField form={form} name='currency' label='Currency' showMessage>
              <BaseSelect
                placeholder='Select currency'
                items={currencyOptions}
                onChange={(value) => form.setValue('currency', value)}
                value={form.watch('currency')}
              />
            </FormField>

            <FormField form={form} name='dueDate' label='Due date' showMessage>
              <DatePicker
                date={form.watch('dueDate')}
                onSelect={(date) => date && form.setValue('dueDate', date)}
                placeholder='Select due date'
              />
            </FormField>
          </div>

          <FormBaseHeader title='Invoice items' />

          <div className='space-y-4'>
            {form.watch('items')?.map((_, index) => (
              <div
                key={`${index}-${form.watch('items')?.length}`}
                className='grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg'>
                <FormField
                  form={form}
                  name={`items.${index}.description`}
                  label='Description'
                  showMessage>
                  <Input placeholder='Item description' />
                </FormField>

                <FormField
                  form={form}
                  name={`items.${index}.quantity`}
                  label='Quantity'
                  showMessage>
                  <Input
                    type='number'
                    min={1}
                    placeholder='1'
                    onChange={(e) =>
                      form.setValue(`items.${index}.quantity`, Number.parseInt(e.target.value))
                    }
                  />
                </FormField>

                <FormField
                  form={form}
                  name={`items.${index}.unitPrice`}
                  label='Unit price'
                  showMessage>
                  <Input
                    type='number'
                    min={0}
                    step={0.01}
                    placeholder='0.00'
                    onChange={(e) =>
                      form.setValue(`items.${index}.unitPrice`, Number.parseFloat(e.target.value))
                    }
                  />
                </FormField>
              </div>
            ))}

            <Button
              type='button'
              variant='outline'
              onClick={() => {
                const items = form.getValues('items') || []
                form.setValue('items', [...items, { description: '', quantity: 1, unitPrice: 0 }])
              }}
              className='w-full'>
              Add another item
            </Button>
          </div>

          <FormField form={form} name='notes' label='Additional notes' showMessage>
            <Textarea
              placeholder='Add any additional notes or payment instructions'
              className='min-h-[100px]'
            />
          </FormField>

          <Button type='submit' className='px-8 self-start'>
            Create invoice
          </Button>
        </FormBase>
      </div>
    </>
  )
}
