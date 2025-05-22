import { SEO } from '~/components/seo'
import { formatDate } from '~/lib/helpers'
import { DetailsLayout } from '~/components/reusable/details-layout'
import { DetailsValue } from '~/components/details-value'
import { getRoutePath } from '~/config/get-route-path'
import { router } from '@inertiajs/react'
import { useDisclosure } from '~/hooks/use-disclosure'
import { ConfirmationDialog } from '~/components/reusable'
import { Badge } from '~/components/ui'
import { formatCurrency } from '~/utils/format'
import type { SingleInvoice } from '~/models/invoice'

const statusColorMap: Record<SingleInvoice['status'], 'completed' | 'todo' | 'high' | 'secondary'> =
  {
    paid: 'completed',
    pending: 'todo',
    overdue: 'high',
  }

export default function InvoiceDetailsPage({ invoice }: { invoice: SingleInvoice }) {
  const { isOpen, onToggle } = useDisclosure()

  const actions = [
    {
      name: 'Edit invoice',
      onClick: () =>
        router.visit(getRoutePath('dashboard_invoices_edit', { invoiceId: invoice.id })),
    },
    {
      name: `Mark as ${invoice.status === 'paid' ? 'overdue' : 'paid'}`,
      onClick: () => router.put(`/invoices/${invoice.id}/mark-as-paid-or-unpaid`),
    },
    {
      name: 'Resend/remind Invoice',
      onClick: () => console.log('Resend/remind invoice:', invoice.id),
    },
    {
      name: 'Delete invoice',
      onClick: () => onToggle(),
    },
  ]

  return (
    <>
      <ConfirmationDialog
        isOpen={isOpen}
        onToggle={onToggle}
        title='Delete invoice'
        description='Are you sure you want to delete this invoice?'
        onCancel={onToggle}
        onConfirm={() => {
          router.delete(`/invoices/${invoice.id}`)
        }}
      />
      <SEO title='Invoice details' description='View and manage invoice information' />
      <DetailsLayout
        title='Invoice details'
        description='View and manage invoice information'
        hasBackButton
        backLink={getRoutePath('dashboard_invoices')}
        actions={actions}>
        <DetailsValue label='Invoice title' className='mb-10'>
          <span className='text-xl'>{invoice.title}</span>
        </DetailsValue>

        {/* Basic Information Section */}
        <div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
            <DetailsValue label='Invoice number'>{invoice.invoiceNumber}</DetailsValue>
            <DetailsValue label='Status'>
              <Badge variant={statusColorMap[invoice.status]}>{invoice.status}</Badge>
            </DetailsValue>
            <DetailsValue label='Customer'>
              {invoice.customer.fullName} - {invoice.customer.email}
            </DetailsValue>
            <DetailsValue label='Due date'>{formatDate(invoice.dueDate, 'full')}</DetailsValue>
            <DetailsValue label='Created at'>{formatDate(invoice.createdAt, 'full')}</DetailsValue>
            <DetailsValue label='Currency'>{invoice.currency.toUpperCase()}</DetailsValue>
          </div>
        </div>

        {/* Services Section */}
        <div>
          <h3 className='text-lg font-semibold mb-4'>Services & Items</h3>
          <div className='space-y-4'>
            {invoice.services.map((service) => (
              <div key={service.id} className='border-b border-gray-200 pb-4'>
                <div className='flex justify-between items-start mb-2'>
                  <div>
                    <div className='font-medium'>{service.name}</div>
                    <div className='text-sm text-gray-500'>{service.description}</div>
                  </div>
                  <div className='text-right'>
                    <div className='font-medium'>
                      {formatCurrency(Number(service.totalPrice), invoice.currency)}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {service.quantity} x{' '}
                      {formatCurrency(Number(service.unitPrice), invoice.currency)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Section */}
        <div className='mt-6 space-y-2'>
          <div className='flex justify-between items-center text-sm font-medium text-gray-600'>
            <span>Subtotal</span>
            <span>{formatCurrency(invoice.amount, invoice.currency)}</span>
          </div>
          {invoice.isDiscounted && (
            <div className='flex justify-between items-center text-sm font-medium text-gray-600'>
              <span>Discount</span>
              <span>
                {invoice.isDiscountedValue}
                {invoice.isDiscountedType === 'percentage'
                  ? '% off'
                  : invoice.currency.toUpperCase()}
              </span>
            </div>
          )}
          <div className='flex justify-between items-center text-base font-semibold border-t border-b border-gray-200 py-3 mt-2'>
            <span>Total</span>
            <span>{formatCurrency(invoice.amount, invoice.currency)}</span>
          </div>
        </div>

        {/* Notes Section */}
        {invoice.notes && (
          <div className='mt-6'>
            <h3 className='text-lg font-semibold mb-4'>Notes</h3>
            <div className='text-gray-600'>{invoice.notes}</div>
          </div>
        )}

        {/* Recurring Information */}
        {invoice.isRecurringInvoice && (
          <div className='mt-6'>
            <h3 className='text-lg font-semibold mb-4'>Recurring Information</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <DetailsValue label='Frequency'>{invoice.isRecurringFrequency}</DetailsValue>
              <DetailsValue label='Start date'>
                {formatDate(invoice.isRecurringStartDate, 'full')}
              </DetailsValue>
              <DetailsValue label='End date'>
                {formatDate(invoice.isRecurringEndDate, 'full')}
              </DetailsValue>
            </div>
          </div>
        )}
      </DetailsLayout>
    </>
  )
}
