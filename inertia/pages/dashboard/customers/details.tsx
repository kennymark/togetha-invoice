import { SEO } from '~/components/seo'
import { formatDate } from '~/lib/helpers'
import { DetailsLayout } from '~/components/reusable/details-layout'
import { DetailsValue } from '~/components/details-value'
import { getRoutePath } from '~/config/get-route-path'
import { router } from '@inertiajs/react'
import { useDisclosure } from '~/hooks/use-disclosure'
import { ConfirmationDialog } from '~/components/reusable'
import type { SingleCustomer } from '~/models/customer.model'

export default function CustomerDetailsPage({ customer }: { customer: SingleCustomer }) {
  const { isOpen, onToggle } = useDisclosure()

  const actions = [
    {
      name: 'Create job',
      onClick: () => router.visit(`/dashboard/jobs/create?customerId=${customer.id}`),
    },
    { name: 'Create invoice', onClick: () => alert('Create invoice') },
    {
      name: 'Delete customer',
      onClick: () => {
        console.log('delete customer')
        onToggle()
      },
    },
  ]

  return (
    <>
      <ConfirmationDialog
        isOpen={isOpen}
        onToggle={onToggle}
        title='Delete customer'
        description='Are you sure you want to delete this customer?'
        onConfirm={() => {
          router.delete(`/customers/${customer.id}`)
        }}
      />
      <SEO title='Customer details' description='View and manage customer information' />
      <DetailsLayout
        title='Customer details'
        description='View and manage customer information'
        hasBackButton
        backLink={getRoutePath('dashboard_customers')}
        actions={actions}>
        <DetailsValue label='Customer name' className='mb-10'>
          <span className='text-xl'>{customer.fullName}</span>
        </DetailsValue>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <DetailsValue label='Email'>{customer.email}</DetailsValue>
          <DetailsValue label='Phone'>{customer.phone}</DetailsValue>
          <DetailsValue label='Address'>{customer.address}</DetailsValue>
          <DetailsValue label='Created at'>{formatDate(customer.createdAt, 'full')}</DetailsValue>
        </div>
      </DetailsLayout>
    </>
  )
}
