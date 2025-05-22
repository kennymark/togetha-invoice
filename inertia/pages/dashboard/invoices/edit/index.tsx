import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormBase, FormBaseHeader } from '~/components/reusable'
import { Button } from '~/components/ui'
import { SEO } from '~/components/seo'
import { PageHeader } from '../../_components/page-header'
import type Customer from '#models/customer'
import type { SingleInvoice } from '~/models/invoice'
import { OnlyShowIf } from '~/components/conditionals'
import { invoiceFormSchema, type InvoiceFormValues } from '~/lib/schemas/invoice'
import {
  calculateInvoiceSubtotal,
  calculateInvoiceTotal,
  handleAddService,
  handleRemoveService,
} from '../_components/helpers'
import { router } from '@inertiajs/react'
import {
  CustomerSelect,
  BasicDetails,
  RecurringInvoice,
  Discount,
  Notes,
  ServiceList,
  InvoiceSummary,
} from '../_components/form_modules'

export default function InvoicesEditPage({
  invoice,
  customers,
}: {
  invoice: SingleInvoice
  customers: Customer[]
}) {
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    mode: 'onChange',
    defaultValues: {
      invoiceNumber: invoice.invoiceNumber,
      customerId: invoice.customerId,
      currency: invoice.currency as 'gbp' | 'usd' | 'eur',
      dueDate: invoice.dueDate,
      title: invoice.title,
      isRecurringInvoice: invoice.isRecurringInvoice,
      isRecurringStartDate: invoice.isRecurringStartDate,
      isRecurringEndDate: invoice.isRecurringEndDate,
      isRecurringFrequency: invoice.isRecurringFrequency as
        | 'daily'
        | 'weekly'
        | 'monthly'
        | 'yearly',
      isDiscounted: invoice.isDiscounted,
      isDiscountedType: invoice.isDiscountedType as 'amount' | 'percentage',
      isDiscountedValue: Number(invoice.isDiscountedValue),
      services:
        invoice.services.length > 0
          ? invoice.services.map((service) => ({
              ...service,
              quantity: Number(service.quantity),
              unitPrice: Number(service.unitPrice),
              totalPrice: Number(service.totalPrice),
            }))
          : [{ name: '', description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
      notes: invoice.notes,
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

  const handleSubmit = (data: InvoiceFormValues) => {
    const processedData = {
      ...data,
      services: data.services.map((service) => ({
        ...service,
        id: service.id,
        quantity: Number(service.quantity),
        unitPrice: Number(service.unitPrice),
        totalPrice: Number(service.totalPrice),
      })),
    }
    router.put(`/invoices/${invoice.id}`, processedData)
  }

  return (
    <>
      <SEO title='Edit Invoice' description='Edit an existing invoice' />
      <PageHeader
        title='Edit Invoice'
        description='Modify invoice details'
        hasBackButton
        backLink='/dashboard/invoices'
      />
      <div className='flex flex-col gap-8 w-full'>
        <FormBase form={form} onSubmit={handleSubmit} className='space-y-7'>
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
            Update invoice
          </Button>
        </FormBase>
      </div>
    </>
  )
}
