import { Head, Link } from '@inertiajs/react'
import { CheckCircle } from 'lucide-react'
import { Button } from '~/components/ui'
import { getRoutePath } from '~/config/get-route-path'
import { formatDate } from '~/lib/helpers'
import type { SingleInvoice } from '~/models/invoice'
import { formatCurrency } from '~/utils/format'

export default function InvoicePaymentSuccess({ invoice }: { invoice: SingleInvoice }) {
  return (
    <>
      <Head title='Payment Successful' />
      <div className=' flex flex-col items-center justify-center p-4'>
        <div className='max-w-2xl w-full bg-white rounded-lg shadow-sm p-8'>
          <div className='text-center mb-8'>
            <div className='flex justify-center mb-4'>
              <CheckCircle className='h-16 w-16 text-green-500' />
            </div>
            <h1 className='text-2xl font-semibold text-gray-900 mb-2'>Payment Successful!</h1>
            <p className='text-gray-600'>Thank you for your payment.</p>
          </div>

          <div className='border-t border-gray-200 pt-6'>
            <h2 className='text-lg font-medium text-gray-900 mb-4'>Invoice Summary</h2>
            <dl className='space-y-4'>
              <div className='flex justify-between'>
                <dt className='text-gray-600'>Invoice Number</dt>
                <dd className='text-gray-900 font-medium'>{invoice.invoiceNumber}</dd>
              </div>
              <div className='flex justify-between'>
                <dt className='text-gray-600'>Amount Paid</dt>
                <dd className='text-gray-900 font-medium'>
                  {formatCurrency(invoice.amount, invoice.currency)}
                </dd>
              </div>
              <div className='flex justify-between'>
                <dt className='text-gray-600'>Date</dt>
                <dd className='text-gray-900 font-medium'>
                  {formatDate(invoice.createdAt, 'medium')}
                </dd>
              </div>
            </dl>
          </div>

          <div className='mt-8 text-center'>
            <p className='text-sm text-gray-500 mb-6'>
              A receipt has been sent to your email address.
            </p>
            <Button variant='tertiary' asChild>
              <Link href={getRoutePath('dashboard_invoices')}>Go to Invoices</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
