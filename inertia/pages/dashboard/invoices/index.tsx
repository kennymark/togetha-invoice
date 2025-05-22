import { SEO } from '~/components/seo'
import { PageHeader } from '../_components/page-header'
import { StatsCard } from '~/components/reusable/stats-card'
import { BaseTable } from '~/components/reusable/table'
import { FileText, Clock, ChevronDown } from 'lucide-react'
import { Button, Badge } from '~/components/ui'
import BaseSheet from '~/components/reusable/base-sheet'
import StatsGrider from '~/components/stats-grider'
import { BaseDropdown } from '~/components/reusable'
import { getRoutePath } from '~/config/get-route-path'
import { useTableState } from '~/hooks/use-table-state'
import { router } from '@inertiajs/react'
import { useDisclosure } from '~/hooks/use-disclosure'
import type { SingleInvoice, Invoices, InvoiceStats } from '~/models/invoice'
import { formatCurrency } from '~/utils/format'
import { formatDate } from '~/lib/helpers'

const statusColorMap: Record<SingleInvoice['status'], 'completed' | 'todo' | 'high' | 'secondary'> =
  {
    paid: 'completed',
    pending: 'todo',
    overdue: 'high',
  }

const invoiceColumns = [
  {
    key: 'customer',
    title: 'Customer',
    render: (_: unknown, item: SingleInvoice) => (
      <div>
        <div>{item.customer.fullName}</div>
        <div className='text-xs text-gray-400'>{item.customer.email}</div>
      </div>
    ),
  },
  {
    key: 'created',
    title: 'Created',
    render: (_: unknown, item: SingleInvoice) => <div>{formatDate(item.createdAt, 'medium')}</div>,
  },
  {
    key: 'amount',
    title: 'Total amount',
    render: (_: unknown, item: SingleInvoice) => (
      <div>{formatCurrency(item.amount, item.currency)}</div>
    ),
  },
  {
    key: 'dueDate',
    title: 'Due date',
    render: (_: unknown, item: SingleInvoice) => <div>{formatDate(item.dueDate, 'medium')}</div>,
  },
  {
    key: 'status',
    title: 'Status',
    render: (_: unknown, item: SingleInvoice) => (
      <Badge variant={statusColorMap[item.status]}>{item.status}</Badge>
    ),
  },
  {
    key: 'actions',
    title: '',
    render: (_: unknown, item: SingleInvoice) => (
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
              onClick: () =>
                router.visit(getRoutePath('dashboard_invoices_details', { invoiceId: item.id })),
            },
            {
              label: 'Edit Invoice',
              onClick: () =>
                router.visit(getRoutePath('dashboard_invoices_edit', { invoiceId: item.id })),
            },
            {
              label: `Mark as ${item.status === 'paid' ? 'overdue' : 'paid'}`,
              onClick: () => router.put(`/invoices/${item.id}/mark-as-paid-or-unpaid`),
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

interface PageProps {
  invoices: Invoices
  stats: InvoiceStats
}

export default function InvoicesPage({ invoices, stats }: PageProps) {
  const { isOpen, onToggle } = useDisclosure()
  const {
    currentPage,
    currentPerPage,
    sortConfig,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
  } = useTableState('invoices')

  return (
    <>
      <BaseSheet
        open={isOpen}
        setOpen={onToggle}
        title='Overdue Invoices'
        description='View your overdue invoices'>
        <div className='p-4'>
          <h3 className='text-lg font-semibold mb-4'>Overdue Invoices</h3>
          <div className='space-y-4'>
            <div className='flex justify-between items-center'>
              <span>Total Invoices</span>
              <span className='font-medium'>{stats.totalInvoices}</span>
            </div>
            <div className='flex justify-between items-center'>
              <span>Overdue Invoices</span>
              <span className='font-medium'>{stats.overdueInvoices}</span>
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
            value={stats.totalInvoices.toString()}
            description=''
          />
          <StatsCard
            icon={<Clock size={24} />}
            label='Overdue invoices'
            value={stats.overdueInvoices.toString()}
            description='pending'
            action={onToggle}
          />
        </StatsGrider>
        {/* Invoices Table */}
        <BaseTable
          resourceName='invoices'
          data={invoices.data}
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
