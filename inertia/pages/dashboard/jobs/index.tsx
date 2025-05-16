import { SEO } from '~/components/seo'
import { PageHeader } from '../_components/page-header'
import { StatsCard } from '~/components/reusable/stats-card'
import { BaseTable } from '~/components/reusable/table/base-table'
import { ClipboardCheck, Users } from 'lucide-react'
import StatsGrider from '~/components/stats-grider'
import { Badge } from '~/components/ui'
import { getRoutePath } from '~/config/get-route-path'
import { EditButton } from '~/components/edit-button'
import { router } from '@inertiajs/react'
import { useTableState } from '~/hooks/use-table-state'
import { formatDate } from '~/lib/helpers'

interface Job {
  id: string
  title: string
  description: string
  category: string
  status: 'pending' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  customer: {
    id: string
    fullName: string
  }
}

interface JobsPageProps {
  jobs: {
    data: Job[]
    meta: {
      total: number
      per_page: number
      current_page: number
      last_page: number
    }
  }
  stats: {
    pendingJobs: number
    completedJobs: number
  }
}

const priorityVariantMap: Record<Job['priority'], 'low' | 'medium' | 'high'> = {
  low: 'low',
  medium: 'medium',
  high: 'high',
}

const statusVariantMap: Record<Job['status'], 'todo' | 'completed' | 'high'> = {
  pending: 'todo',
  completed: 'completed',
  cancelled: 'high',
}

export default function JobsPage({ jobs, stats }: JobsPageProps) {
  const {
    currentPage,
    currentPerPage,
    sortConfig,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
  } = useTableState('jobs')

  const columns = [
    {
      key: 'title',
      title: 'Job Title',
      sortable: true,
    },
    {
      key: 'customer',
      title: 'Customer',
      render: (_: unknown, job: Job) => (
        <div className='font-semibold'>{job.customer.fullName}</div>
      ),
      sortable: true,
    },
    {
      key: 'category',
      title: 'Category',
      sortable: true,
    },
    {
      key: 'priority',
      title: 'Priority',
      render: (_: unknown, job: Job) => (
        <Badge variant={priorityVariantMap[job.priority]}>{job.priority}</Badge>
      ),
      sortable: true,
    },
    {
      key: 'status',
      title: 'Status',
      render: (_: unknown, job: Job) => (
        <Badge variant={statusVariantMap[job.status]}>{job.status}</Badge>
      ),
      sortable: true,
    },
    {
      key: 'dueDate',
      title: 'Due Date',
      render: (_: unknown, job: Job) => (
        <div className='font-medium'>{formatDate(job.dueDate, 'medium')}</div>
      ),
      sortable: true,
    },
    {
      key: 'actions',
      title: '',
      align: 'right' as const,
      render: (_: unknown, job: Job) => (
        <EditButton
          onClick={() => router.visit(getRoutePath('dashboard_jobs_edit', { jobId: job.id }))}
        />
      ),
    },
  ]

  return (
    <>
      <SEO title='Jobs' description='Manage your jobs and tasks.' />
      <PageHeader title='Jobs' description='Manage your jobs and tasks.' />
      <div className='flex flex-col gap-8 w-full'>
        <StatsGrider>
          <StatsCard
            icon={<ClipboardCheck size={24} />}
            label='Completed jobs'
            value={stats.completedJobs}
            description='done in total'
          />
          <StatsCard
            icon={<Users size={24} />}
            label='Pending jobs'
            value={stats.pendingJobs}
            description='currently ongoing'
          />
        </StatsGrider>

        <BaseTable<Job>
          resourceName='jobs'
          data={jobs.data}
          columns={columns}
          emptyMessage='No jobs found.'
          searchPlaceholder='Search jobs...'
          createButtonText='Create Job'
          currentPage={currentPage}
          currentPerPage={currentPerPage}
          sortConfig={sortConfig}
          onSort={handleSort}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSearch={handleSearch}
          onExport={() => {}}
          onCreate={() => router.visit(getRoutePath('dashboard_jobs_create'))}
          title={undefined}
        />
      </div>
    </>
  )
}
