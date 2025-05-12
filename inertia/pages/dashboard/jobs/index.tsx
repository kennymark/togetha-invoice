import { SEO } from '~/components/seo'
import { PageHeader } from '../_components/page-header'
import { StatsCard } from '~/components/reusable/stats-card'
import { BaseTable } from '~/components/reusable/table'
import { Users, ClipboardCheck, ChevronDown } from 'lucide-react'
import { useTableState } from '~/hooks/use-table-state'
import StatsGrider from '~/components/stats-grider'
import { Button, Badge } from '~/components/ui'
import BaseDropdown from '~/components/reusable/base-dropdown'
import { getRoutePath } from '~/config/get-route-path'
import { router } from '@inertiajs/react'

interface Job {
  id: string
  title: string
  customer: string
  address: string
  assigned: string
  priority: 'Low' | 'Medium' | 'High'
  status: 'Todo' | 'In Progress' | 'Completed'
  dueDate: string
}

const jobData: Job[] = [
  {
    id: '1',
    title: 'Broken shower glass',
    customer: 'Mpho Herbulot',
    address: '85 Glover Lights Build, L14NT, Norwich',
    assigned: '2 days ago',
    priority: 'Low',
    status: 'Todo',
    dueDate: '20th Jun 2025',
  },
  {
    id: '2',
    title: 'Broken shower glass',
    customer: 'Mpho Herbulot',
    address: '85 Glover Lights Build, L14NT, Norwich',
    assigned: '2 days ago',
    priority: 'High',
    status: 'In Progress',
    dueDate: '20th Jun 2025',
  },
  {
    id: '3',
    title: 'Broken shower glass',
    customer: 'Mpho Herbulot',
    address: '85 Glover Lights Build, L14NT, Norwich',
    assigned: '2 days ago',
    priority: 'Medium',
    status: 'Completed',
    dueDate: '20th Jun 2025',
  },
]

const priorityVariantMap: Record<Job['priority'], 'low' | 'medium' | 'high'> = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
}

const statusVariantMap: Record<Job['status'], 'todo' | 'in-progress' | 'completed'> = {
  Todo: 'todo',
  'In Progress': 'in-progress',
  Completed: 'completed',
}

const jobColumns = [
  { key: 'title', title: 'Job/Issue title' },
  {
    key: 'customer',
    title: 'Customer details',
    render: (_: unknown, job: Job) => (
      <div>
        <div className='font-semibold'>{job.customer}</div>
        <div className='text-xs text-gray-400'>{job.address}</div>
      </div>
    ),
  },
  { key: 'assigned', title: 'Assigned' },
  {
    key: 'priority',
    title: 'Priority',
    render: (_: unknown, job: Job) => (
      <Badge variant={priorityVariantMap[job.priority]}>{job.priority}</Badge>
    ),
  },
  {
    key: 'status',
    title: 'Status',
    render: (_: unknown, job: Job) => (
      <Badge variant={statusVariantMap[job.status]}>{job.status}</Badge>
    ),
  },
  { key: 'dueDate', title: 'Due date' },
  {
    key: 'actions',
    title: '',
    render: (_: unknown, job: Job) => (
      <BaseDropdown
        trigger={
          <Button variant='outline' size='sm'>
            Menu
            <ChevronDown size={16} />
          </Button>
        }
        items={[
          {
            label: 'View Details',
            onClick: () => console.log('View details for job:', job.id),
          },
          {
            label: 'Edit Job',
            onClick: () => console.log('Edit job:', job.id),
          },
          {
            label: 'Mark as Completed',
            onClick: () => console.log('Mark as completed:', job.id),
          },
          {
            label: 'Create Invoice',
            onClick: () => console.log('Create invoice for job:', job.id),
          },
        ]}
      />
    ),
  },
]

export default function JobsPage() {
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
      <SEO title='All Jobs' description='View and manage all your job activity.' />
      <PageHeader title='All Jobs' description='View and manage all your job activity.' />
      <div className='flex flex-col gap-8 w-full'>
        <StatsGrider>
          <StatsCard
            icon={<ClipboardCheck size={24} />}
            label='Completed jobs'
            value={30}
            description='done in total'
          />
          <StatsCard
            icon={<Users size={24} />}
            label='Active jobs'
            value={30}
            description='currently ongoing'
          />
        </StatsGrider>
        <BaseTable
          data={jobData}
          columns={jobColumns}
          title='All Jobs'
          isNumbered={true}
          containerClassName='mt-2'
          emptyMessage='No jobs found.'
          createButtonText='Create Job'
          onCreate={() => router.visit(getRoutePath('dashboard_jobs_create'))}
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
