import { SEO } from '~/components/seo'
import { PageHeader } from '../_components/page-header'
import { StatsCard } from '~/components/reusable/stats-card'
import { WalletIcon } from 'lucide-react'
import { Briefcase, Document } from 'iconsax-react'
import { useState, Suspense, lazy } from 'react'
import { BaseTable } from '~/components/reusable/table'
import { useTableState } from '~/hooks/use-table-state'
import StatsGrider from '~/components/stats-grider'
import usePageProps from '~/hooks/use-page-props'

const EarningsSheet = lazy(() => import('~/pages/dashboard/root/_components/earnings-sheet'))

export default function DashboardPage() {
  const { user } = usePageProps()

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
      <Suspense fallback={null}>
        {isSheetOpen && <EarningsSheet open={isSheetOpen} setOpen={setIsSheetOpen} />}
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
            value='£5,000'
            description='in April 2025'
            action={() => setIsSheetOpen(true)}
          />
          <StatsCard
            icon={<Document color='black' size={20} />}
            label='Unpaid invoices'
            value='30'
            description='pending'
          />
          <StatsCard
            icon={<Briefcase color='black' size={20} />}
            label='Active Jobs'
            value='7'
            description='on going'
          />
        </StatsGrider>

        {/* Recent Activity Table */}
        <BaseTable
          data={recentActivityData}
          columns={recentActivityColumns}
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
        />
      </div>
    </>
  )
}

// Add mock data and columns for recent activity table
interface RecentActivityItem {
  id: string
  activity: string
  by: string
  date: string
  avatarColor: string
  avatarText: string
}

const recentActivityData: RecentActivityItem[] = [
  {
    id: '1',
    activity: '£1200 payment received via payment link',
    by: 'Sarah White',
    date: 'Today',
    avatarColor: 'bg-blue-200 text-blue-900',
    avatarText: 'SW',
  },
  {
    id: '2',
    activity: 'Invoice sent to John Smith',
    by: 'You',
    date: 'Today',
    avatarColor: 'bg-gray-200 text-gray-700',
    avatarText: 'JJ',
  },
  {
    id: '3',
    activity: 'Job request received',
    by: 'Lee Ting',
    date: 'Today',
    avatarColor: 'bg-purple-600 text-white',
    avatarText: 'LT',
  },
  {
    id: '4',
    activity: 'New client onboarded',
    by: 'Maria Garcia',
    date: 'Yesterday',
    avatarColor: 'bg-green-200 text-green-900',
    avatarText: 'MG',
  },
  {
    id: '5',
    activity: 'Project milestone completed',
    by: 'Alex Chen',
    date: 'Yesterday',
    avatarColor: 'bg-yellow-200 text-yellow-900',
    avatarText: 'AC',
  },
  {
    id: '6',
    activity: 'Contract signed',
    by: 'David Kim',
    date: '2 days ago',
    avatarColor: 'bg-red-200 text-red-900',
    avatarText: 'DK',
  },
  {
    id: '7',
    activity: 'Invoice overdue reminder sent',
    by: 'Emma Wilson',
    date: '2 days ago',
    avatarColor: 'bg-indigo-200 text-indigo-900',
    avatarText: 'EW',
  },
  {
    id: '8',
    activity: 'New project proposal sent',
    by: 'James Brown',
    date: '3 days ago',
    avatarColor: 'bg-pink-200 text-pink-900',
    avatarText: 'JB',
  },
  {
    id: '9',
    activity: 'Client meeting scheduled',
    by: 'Sophie Taylor',
    date: '3 days ago',
    avatarColor: 'bg-orange-200 text-orange-900',
    avatarText: 'ST',
  },
  {
    id: '10',
    activity: 'Project scope updated',
    by: 'Michael Lee',
    date: '4 days ago',
    avatarColor: 'bg-teal-200 text-teal-900',
    avatarText: 'ML',
  },
  {
    id: '11',
    activity: 'Payment reminder sent',
    by: 'Lisa Wong',
    date: '4 days ago',
    avatarColor: 'bg-cyan-200 text-cyan-900',
    avatarText: 'LW',
  },
  {
    id: '12',
    activity: 'New team member added',
    by: 'Robert Chen',
    date: '5 days ago',
    avatarColor: 'bg-lime-200 text-lime-900',
    avatarText: 'RC',
  },
  {
    id: '13',
    activity: 'Project deadline extended',
    by: 'Anna Smith',
    date: '5 days ago',
    avatarColor: 'bg-amber-200 text-amber-900',
    avatarText: 'AS',
  },
  {
    id: '14',
    activity: 'Client feedback received',
    by: 'Tom Wilson',
    date: '6 days ago',
    avatarColor: 'bg-emerald-200 text-emerald-900',
    avatarText: 'TW',
  },
  {
    id: '15',
    activity: 'New service package created',
    by: 'Rachel Green',
    date: '6 days ago',
    avatarColor: 'bg-violet-200 text-violet-900',
    avatarText: 'RG',
  },
]

const recentActivityColumns = [
  {
    key: 'activity',
    title: 'Activity',
    render: (value: unknown, item: RecentActivityItem) => (
      <div className='flex items-center gap-3'>
        <span
          className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-base ${item.avatarColor}`}>
          {item.avatarText}
        </span>
        <span>{item.activity}</span>
      </div>
    ),
  },
  {
    key: 'by',
    title: 'By',
  },
  {
    key: 'date',
    title: 'Date',
  },
]
