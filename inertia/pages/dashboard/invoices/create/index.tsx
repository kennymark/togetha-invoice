import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormBase, FormBaseHeader } from '~/components/reusable'
import { Button } from '~/components/ui'
import { SEO } from '~/components/seo'
import { PageHeader } from '../../_components/page-header'
import type Customer from '#models/customer'
import useQueryParams from '~/hooks/use-query-params'
import { invoiceFormSchema } from '~/lib/schemas/invoice'
import { FakeDataGenerator } from '~/components/dev/fake-data-generator'
import { OnlyShowIf } from '~/components/conditionals'
import {
  calculateInvoiceSubtotal,
  calculateInvoiceTotal,
  handleAddService,
  handleRemoveService,
  handleSubmit,
} from '../_components/helpers'
import {
  CustomerSelect,
  BasicDetails,
  RecurringInvoice,
  Discount,
  Notes,
  ServiceList,
  InvoiceSummary,
} from '../_components/form_modules'

export default function InvoicesCreatePage({ customers }: { customers: Customer[] }) {
  const { customerId } = useQueryParams()

  const form = useForm({
    resolver: zodResolver(invoiceFormSchema),
    mode: 'onChange',
    defaultValues: {
      invoiceNumber: '',
      customerId: customerId || '',
      currency: 'gbp',
      dueDate: new Date().toISOString(),
      isRecurringInvoice: false,
      isRecurringStartDate: new Date().toISOString(),
      isRecurringEndDate: new Date().toISOString(),
      isRecurringFrequency: 'monthly',
      isDiscounted: false,
      isDiscountedType: 'amount',
      isDiscountedValue: 0,
      services: [{ name: '', description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
      notes: '',
    },
  })

  const services = form.watch('services')
  const subtotal = calculateInvoiceSubtotal(services)
  const total = calculateInvoiceTotal(
    subtotal,
    form.watch('isDiscountedValue'),
    form.watch('isDiscountedType'),
    form,
  )

  return (
    <>
      <SEO title='Create Invoice' description='Create a new invoice for your customers' />
      <PageHeader title='Create Invoice' description='Generate professional invoices in seconds' />
      <div className='flex flex-col gap-8 w-full'>
        <FormBase form={form} onSubmit={handleSubmit} className='space-y-7'>
          <FakeDataGenerator
            type='invoice'
            onGenerate={form.reset}
            onAfterGenerate={() => {
              form.trigger()
              form.getValues('services').forEach((_, index) => {
                const quantity = form.getValues(`services.${index}.quantity`)
                const unitPrice = form.getValues(`services.${index}.unitPrice`)
                form.setValue(`services.${index}.totalPrice`, quantity * unitPrice)
              })
            }}
          />
          <FormBaseHeader title='Invoice details' />

          <CustomerSelect form={form} customers={customers} />
          <BasicDetails form={form} />
          <RecurringInvoice form={form} />
          <Discount form={form} />
          <Notes form={form} />

          <FormBaseHeader title='Services & items' />
          <ServiceList
            form={form}
            onAddService={() => handleAddService(form)}
            onRemoveService={(index) => handleRemoveService(form, index)}
          />

          <OnlyShowIf condition={services?.length > 0}>
            <InvoiceSummary form={form} subtotal={subtotal} total={total} />
          </OnlyShowIf>

          <Button type='submit' className='px-8 self-start'>
            Send invoice
          </Button>
        </FormBase>
      </div>
    </>
  )
}
