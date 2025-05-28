import { SEO } from '~/components/seo'
import { PageHeader } from '../_components/page-header'
import { StatsCard } from '~/components/reusable/stats-card'
import { WalletIcon } from 'lucide-react'
import { Briefcase, Document } from 'iconsax-react'
import { Suspense, lazy } from 'react'
import { BaseTable } from '~/components/reusable/table'
import { useTableState } from '~/hooks/use-table-state'
import StatsGrider from '~/components/stats-grider'
import usePageProps from '~/hooks/use-page-props'
import { formatCurrency } from '~/utils/format'
import { formatDistanceToNow } from 'date-fns'
import { Link } from '@inertiajs/react'
import type { Activities, ActivityStats, SingleActivity } from '~/models/activity.model'
import { useDisclosure } from '~/hooks/use-disclosure'

const EarningsSheet = lazy(() => import('~/pages/dashboard/home/_components/earnings-sheet'))

export default function DashboardPage({
  activities,
  stats,
}: {
  activities: Activities
  stats: ActivityStats
}) {
  const { user } = usePageProps()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    currentPage,
    currentPerPage,
    sortConfig,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
  } = useTableState('activities')

  const getAvatarColor = (type: string) => {
    const colors: Record<string, string> = {
      paid: 'bg-green-200 text-green-900',
      created: 'bg-blue-200 text-blue-900',
      updated: 'bg-yellow-200 text-yellow-900',
      deleted: 'bg-red-200 text-red-900',
      completed: 'bg-purple-200 text-purple-900',
      default: 'bg-gray-200 text-gray-700',
    }
    return colors[type] || colors.default
  }

  const getAvatarText = (activity: SingleActivity) => {
    if (activity.customer) return activity.customer.fullName.slice(0, 2).toUpperCase()
    if (activity.job) return 'JB'
    if (activity.invoice) return 'IN'
    return 'AC'
  }

  const getActivityLink = (activity: SingleActivity) => {
    if (activity.job) {
      return `/dashboard/jobs/${activity.job.id}`
    }
    if (activity.invoice) {
      return `/dashboard/invoices/${activity.invoice.id}`
    }
    if (activity.customer) {
      return `/dashboard/customers/${activity.customer.id}`
    }
    return null
  }

  const activityColumns = [
    {
      key: 'activity',
      title: 'Activity',
      render: (_: unknown, item: SingleActivity) => {
        const link = getActivityLink(item)
        const content = (
          <div className='flex items-center gap-3'>
            <span
              className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-base ${getAvatarColor(
                item.type,
              )}`}>
              {getAvatarText(item)}
            </span>
            <span>{item.summary}</span>
          </div>
        )

        if (link) {
          return (
            <Link href={link} className='hover:opacity-80 transition-opacity'>
              {content}
            </Link>
          )
        }

        return content
      },
    },
    {
      key: 'by',
      title: 'By',
      render: (_: unknown, item: SingleActivity) => {
        const link = item.customer ? `/dashboard/customers/${item.customer.id}` : null
        const content = item.customer?.fullName || 'You'

        if (link) {
          return (
            <Link href={link} className='hover:opacity-80 transition-opacity'>
              {content}
            </Link>
          )
        }

        return content
      },
    },
    {
      key: 'date',
      title: 'Date',
      render: (_: unknown, item: SingleActivity) =>
        // @ts-ignore
        formatDistanceToNow(item.createdAt, { addSuffix: true }),
    },
  ]

  return (
    <>
      <Suspense fallback={null}>
        {isOpen && <EarningsSheet open={isOpen} onClose={onClose} />}
      </Suspense>
      <SEO title='Dashboard' description='A clear view of your business — all in one place.' />
      <div className='flex flex-col gap-8 w-full'>
        <PageHeader
          title={`Welcome back, ${user?.fullName}`}
          description='A clear view of your business — all in one place.'
        />
        <StatsGrider cols={3}>
          <StatsCard
            icon={<WalletIcon size={20} />}
            label='Total Earnings'
            value={formatCurrency(stats.totalEarnings || 0)}
            description='All time'
            action={onOpen}
          />
          <StatsCard
            icon={<Document color='black' size={20} />}
            label='Unpaid invoices'
            value={stats.unpaidInvoices.toString()}
            description='pending'
          />
          <StatsCard
            icon={<Briefcase color='black' size={20} />}
            label='Active Jobs'
            value={stats.activeJobs.toString()}
            description='on going'
          />
        </StatsGrider>

        {/* Recent Activity Table */}
        <BaseTable
          data={activities.data}
          columns={activityColumns}
          title='Recent activity'
          isNumbered={false}
          containerClassName='mt-8'
          emptyMessage='No recent activity.'
          searchPlaceholder='Search activities...'
          noDates={true}
          noFilter={true}
          noReset={true}
          currentPage={currentPage}
          currentPerPage={currentPerPage}
          sortConfig={sortConfig}
          onSort={handleSort}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSearch={handleSearch}
          resourceName='activities'
        />
      </div>
    </>
  )
}
