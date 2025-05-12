import { SEO } from '~/components/seo'
import { PageHeader } from '../_components/page-header'
import { StatsCard } from '~/components/reusable/stats-card'
import { BaseTable } from '~/components/reusable/table'
import { FileText, Clock, ChevronDown } from 'lucide-react'
import { Button, Badge } from '~/components/ui'
import BaseSheet from '~/components/reusable/base-sheet'
import { useState } from 'react'
import StatsGrider from '~/components/stats-grider'
import { BaseDropdown } from '~/components/reusable'
import { getRoutePath } from '~/config/get-route-path'
import { useTableState } from '~/hooks/use-table-state'
import { router } from '@inertiajs/react'

interface Invoice {
  id: string
  customer: string
  email: string
  created: string
  amount: string
  dueDate: string
  status: 'Paid' | 'Upcoming' | 'Overdue' | 'Draft'
}

const invoiceData: Invoice[] = [
  {
    id: '1',
    customer: 'Mpho Herbulot',
    email: 'jesus.bjarnasin99@ntlworld.dev',
    created: '2 days ago',
    amount: '£400',
    dueDate: '20th Jun 2024',
    status: 'Paid',
  },
  {
    id: '2',
    customer: 'Mpho Herbulot',
    email: 'jesus.bjarnasin99@ntlworld.dev',
    created: '6 days ago',
    amount: '£233.5',
    dueDate: '20th Jun 2024',
    status: 'Upcoming',
  },
  {
    id: '3',
    customer: 'Mpho Herbulot',
    email: 'jesus.bjarnasin99@ntlworld.dev',
    created: '6 days ago',
    amount: '£90',
    dueDate: '20th Jun 2024',
    status: 'Overdue',
  },
  {
    id: '4',
    customer: 'Mpho Herbulot',
    email: 'jesus.bjarnasin99@ntlworld.dev',
    created: '-',
    amount: '£108',
    dueDate: '-',
    status: 'Draft',
  },
]

const statusColorMap: Record<Invoice['status'], 'completed' | 'todo' | 'high' | 'secondary'> = {
  Paid: 'completed',
  Upcoming: 'todo',
  Overdue: 'high',
  Draft: 'secondary',
}

const invoiceColumns = [
  {
    key: 'customer',
    title: 'Customer',
    render: (_: unknown, item: Invoice) => (
      <div>
        <div>{item.customer}</div>
        <div className='text-xs text-gray-400'>{item.email}</div>
      </div>
    ),
  },
  { key: 'created', title: 'Created' },
  { key: 'amount', title: 'Total amount' },
  { key: 'dueDate', title: 'Due date' },
  {
    key: 'status',
    title: 'Status',
    render: (_: unknown, item: Invoice) => (
      <Badge variant={statusColorMap[item.status]}>{item.status}</Badge>
    ),
  },
  {
    key: 'actions',
    title: '',
    render: (_: unknown, item: Invoice) => (
      <div className='flex gap-2'>
        <BaseDropdown
          trigger={
            <Button variant='outline' size='sm'>
              Menu
              <ChevronDown size={16} />
            </Button>
          }
          items={[
            {
              label: 'View Invoice',
              onClick: () => console.log('View details for invoice:', item.id),
            },
            {
              label: 'Edit Invoice',
              onClick: () => console.log('Edit invoice:', item.id),
            },
            {
              label: 'Mark as Paid/unpaid',
              onClick: () => console.log('Edit invoice:', item.id),
            },
            {
              label: 'Resend/remind Invoice',
              onClick: () => console.log('Resend/remind invoice:', item.id),
            },
            {
              label: 'Archive Invoice',
              onClick: () => console.log('Archive invoice:', item.id),
            },
          ]}
        />
      </div>
    ),
  },
]

export default function InvoicesPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const {
    currentPage,
    currentPerPage,
    sortConfig,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
  } = useTableState()

  return (
    <>
      <BaseSheet
        open={isSheetOpen}
        setOpen={setIsSheetOpen}
        title='Overdue Invoices'
        description='View your overdue invoices'>
        <div className='p-4'>
          <h3 className='text-lg font-semibold mb-4'>Overdue Invoices</h3>
          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <span>Total Earnings</span>
              <span className='font-medium'>£5,000</span>
            </div>
            <div className='flex justify-between items-center'>
              <span>Paid Invoices</span>
              <span className='font-medium'>£4,200</span>
            </div>
            <div className='flex justify-between items-center'>
              <span>Pending Payments</span>
              <span className='font-medium'>£800</span>
            </div>
          </div>
        </div>
      </BaseSheet>
      <SEO title='Invoices' description='View, send, and track all your invoices' />
      <PageHeader title='Invoices' description='View, send, and track all your invoices' />
      <div className='flex flex-col gap-8 w-full'>
        {/* Stats Cards */}
        <StatsGrider>
          <StatsCard
            icon={<FileText size={24} />}
            label='Total Invoices sent'
            value='225'
            description=''
          />
          <StatsCard
            icon={<Clock size={24} />}
            label='Overdue invoices'
            value='30'
            description='pending'
            action={() => setIsSheetOpen(true)}
          />
        </StatsGrider>
        {/* Invoices Table */}
        <BaseTable
          data={invoiceData}
          columns={invoiceColumns}
          title='All Invoices'
          isNumbered={true}
          containerClassName='mt-2'
          emptyMessage='No invoices found.'
          createButtonText='Create Invoice'
          onCreate={() => router.visit(getRoutePath('dashboard_invoices_create'))}
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
