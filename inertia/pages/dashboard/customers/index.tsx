import { SEO } from '~/components/seo'
import { PageHeader } from '../_components/page-header'
import { StatsCard } from '~/components/reusable/stats-card'
import { BaseTable } from '~/components/reusable/table/base-table'
import BaseAvatar from '~/components/reusable/base-avatar'
import StatsGrider from '~/components/stats-grider'
import { Users } from 'lucide-react'
import { getRoutePath } from '~/config/get-route-path'
import { EditButton } from '~/components/edit-button'
import type { Customers, SingleCustomer } from '~/models/customer.model'
import { Link, router } from '@inertiajs/react'
import { useTableState } from '~/hooks/use-table-state'

export default function CustomersPage({
  customers,
  stats,
}: {
  customers: Customers
  stats: number
}) {
  const {
    currentPage,
    currentPerPage,
    sortConfig,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
  } = useTableState('customers')

  const columns = [
    {
      key: 'name',
      title: 'Name',
      render: (_: unknown, customer: SingleCustomer) => (
        <Link
          href={getRoutePath('dashboard_customers_details', { customerId: customer.id })}
          className='flex items-center gap-3'>
          <BaseAvatar size='sm' name={customer.fullName} alt={customer.fullName} />
          <span className='hover:underline'>{customer.fullName}</span>
        </Link>
      ),
      sortable: true,
    },
    {
      key: 'email',
      title: 'Email',
      sortable: true,
    },
    {
      key: 'phone',
      title: 'Phone Number',
      sortable: false,
    },
    {
      key: 'actions',
      title: '',
      align: 'right' as const,
      render: (_: unknown, customer: SingleCustomer) => (
        <EditButton
          onClick={() =>
            router.visit(getRoutePath('dashboard_customers_edit', { customerId: customer.id }))
          }
        />
      ),
    },
  ]

  return (
    <>
      <SEO title='Customers' description='Manage your customer relationships and information.' />
      <PageHeader
        title='Customers'
        description='Manage your customer relationships and information.'
      />
      <div className='flex flex-col gap-8 w-full'>
        <StatsGrider>
          <StatsCard icon={<Users size={24} />} label='Total customers' value={stats || 0} />
        </StatsGrider>

        <BaseTable<SingleCustomer>
          resourceName='customers'
          data={customers.data || []}
          columns={columns}
          emptyMessage='No customers found.'
          searchPlaceholder='Search customers...'
          createButtonText='Add a customer'
          currentPage={currentPage}
          currentPerPage={currentPerPage}
          sortConfig={sortConfig}
          onSort={handleSort}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSearch={handleSearch}
          onExport={() => {}}
          onCreate={() => router.visit(getRoutePath('dashboard_customers_create'))}
          title={undefined}
        />
      </div>
    </>
  )
}
