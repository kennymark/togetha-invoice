import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormBase, FormBaseHeader, FormField, BaseSelect } from '~/components/reusable'
import { Input, Button, Textarea } from '~/components/ui'
import { SEO } from '~/components/seo'
import { PageHeader } from '../../_components/page-header'
import { paymentFormSchema, type PaymentFormValues } from '~/lib/schemas/payment'

const currencyOptions = [
  { value: 'gbp', label: 'GBP (£)' },
  { value: 'usd', label: 'USD ($)' },
  { value: 'eur', label: 'EUR (€)' },
]

export default function PaymentsCreatePage() {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      serviceTitle: '',
      amount: '',
      currency: 'gbp',
      description: '',
    },
  })

  function handleSubmit(data: PaymentFormValues) {
    console.log('payment data', data)
    // TODO: Implement submission logic
    // e.g., call API, show notification, etc.
  }

  return (
    <>
      <SEO
        title='Create Payment Link'
        description='Create a new payment link to receive payments from customers'
      />
      <PageHeader
        title='Create Payment Link'
        description='Fill in the details and generate a link in seconds'
      />
      <div className='flex flex-col gap-8 w-full'>
        <FormBase form={form} onSubmit={handleSubmit} className='space-y-7'>
          <FormBaseHeader title='Service details' />

          <FormField form={form} name='serviceTitle' label='Service title' showMessage>
            <Input placeholder='Cleaning services' />
          </FormField>
          <FormField form={form} name='description' label='Service Description' showMessage>
            <Textarea
              placeholder='Add any additional details about this payment'
              className='min-h-[100px]'
            />
          </FormField>

          <FormBaseHeader title='Payment details' />

          <div className='grid grid-cols-2 gap-4 pb-8'>
            <FormField form={form} name='currency' label='Make payment in' showMessage>
              <BaseSelect
                placeholder='Select currency'
                items={currencyOptions}
                onChange={(value) => form.setValue('currency', value)}
                value={form.watch('currency')}
              />
            </FormField>
            <FormField form={form} name='amount' label='Amount' showMessage>
              <Input placeholder='100.00' type='text' />
            </FormField>
          </div>

          <Button type='submit' className='px-8 self-start'>
            Create payment link
          </Button>
        </FormBase>
      </div>
    </>
  )
}
