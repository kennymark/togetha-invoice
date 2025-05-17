import { SEO } from '~/components/seo'
import { PageHeader } from '../_components/page-header'
import { BaseTable } from '~/components/reusable/table'
import { Button } from '~/components/ui'
import { Clipboard } from 'lucide-react'
import { useTableState } from '~/hooks/use-table-state'
import { getRoutePath } from '~/config/get-route-path'
import { router } from '@inertiajs/react'

interface PaymentLink {
  id: string
  url: string
  serviceTitle: string
  amount: string
  createdOn: string
  status: 'Active' | 'Inactive' | 'Expired'
}

const paymentLinks: PaymentLink[] = [
  {
    id: '1',
    url: 'https://pay.chargeweb3.com/link/67ea693d8ce00c2d6e176dc0',
    serviceTitle: 'Coffee',
    amount: '$40',
    createdOn: '20th Jun 2024',
    status: 'Active',
  },
  {
    id: '2',
    url: 'https://pay.chargeweb3.com/link/67ea693d8ce00c2d6e176dc0',
    serviceTitle: 'Coffee',
    amount: '$509',
    createdOn: '20th Jun 2024',
    status: 'Inactive',
  },
  {
    id: '3',
    url: 'https://pay.chargeweb3.com/link/67ea693d8ce00c2d6e176dc0',
    serviceTitle: 'Coffee',
    amount: '$509',
    createdOn: '20th Jun 2024',
    status: 'Expired',
  },
]

const statusColorMap: Record<PaymentLink['status'], string> = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-gray-100 text-gray-500',
  Expired: 'bg-gray-200 text-gray-400',
}

const paymentColumns = [
  {
    key: 'url',
    title: 'Link',
    render: (value: unknown, item: PaymentLink) => (
      <div className='flex items-center gap-2'>
        <Button
          variant='ghost'
          size='icon'
          className='p-1'
          onClick={() => navigator.clipboard.writeText(item.url)}>
          <Clipboard size={16} />
        </Button>
        <span className='truncate max-w-xs'>{item.url}</span>
      </div>
    ),
  },
  { key: 'serviceTitle', title: 'Service title' },
  { key: 'amount', title: 'Amount' },
  { key: 'createdOn', title: 'Created on' },
  {
    key: 'status',
    title: 'Status',
    render: (value: unknown, item: PaymentLink) => (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColorMap[item.status]}`}>
        {item.status}
      </span>
    ),
  },
  {
    key: 'actions',
    title: '',
    render: () => (
      <Button variant='ghost' size='icon' className='p-1'>
        Menu
      </Button>
    ),
  },
]

export default function PaymentsPage() {
  const {
    currentPage,
    currentPerPage,
    sortConfig,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
  } = useTableState('payments')

  return (
    <>
      <SEO
        title='Payment links'
        description='Create and manage shareable payment links to get paid faster'
      />
      <PageHeader
        title='Payment links'
        description='Create and manage shareable payment links to get paid faster'
      />
      <div className='flex flex-col gap-8 w-full'>
        <BaseTable
          resourceName='payments'
          data={paymentLinks}
          columns={paymentColumns}
          title={undefined}
          isNumbered={false}
          containerClassName='mt-2'
          emptyMessage='No payment links found.'
          createButtonText='Create payment link'
          onCreate={() => router.visit(getRoutePath('dashboard_payments_create'))}
          onExport={() => {}}
          searchPlaceholder='Search'
          currentPage={currentPage}
          currentPerPage={currentPerPage}
          sortConfig={sortConfig}
          onSort={handleSort}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSearch={handleSearch}
        />
      </div>
    </>
  )
}
