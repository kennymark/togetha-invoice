import { SEO } from '~/components/seo'
import { PageHeader } from '../_components/page-header'
import { StatsCard } from '~/components/reusable/stats-card'
import { BaseTable } from '~/components/reusable/table/base-table'
import { ClipboardCheck, Users } from 'lucide-react'
import StatsGrider from '~/components/stats-grider'
import { Badge } from '~/components/ui'
import { getRoutePath } from '~/config/get-route-path'
import { EditButton } from '~/components/edit-button'
import { Link, router } from '@inertiajs/react'
import { useTableState } from '~/hooks/use-table-state'
import { formatDate } from '~/lib/helpers'
import type { JobStats, SingleJob } from '~/models/jobs.model'
import type { Meta } from '~/models/extra.model'

const priorityVariantMap: Record<SingleJob['priority'], 'low' | 'medium' | 'high'> = {
  low: 'low',
  medium: 'medium',
  high: 'high',
}

const statusVariantMap: Record<SingleJob['status'], 'todo' | 'completed' | 'high'> = {
  pending: 'todo',
  completed: 'completed',
  cancelled: 'high',
}

interface JobsPageProps {
  jobs: {
    data: SingleJob[]
    meta: Meta
  }
  stats: JobStats
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
      render: (_: unknown, job: SingleJob) => (
        <Link
          href={getRoutePath('dashboard_jobs_details', { jobId: job.id })}
          className='font-semibold hover:underline'>
          {job.title}
        </Link>
      ),
      sortable: true,
    },
    {
      key: 'customer',
      title: 'Customer',
      render: (_: unknown, job: SingleJob) => (
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
      render: (_: unknown, job: SingleJob) => (
        <Badge variant={priorityVariantMap[job.priority]}>{job.priority}</Badge>
      ),
      sortable: true,
    },
    {
      key: 'status',
      title: 'Status',
      render: (_: unknown, job: SingleJob) => (
        <Badge variant={statusVariantMap[job.status]}>{job.status}</Badge>
      ),
      sortable: true,
    },
    {
      key: 'dueDate',
      title: 'Due Date',
      render: (_: unknown, job: SingleJob) => (
        <div className='font-medium'>{formatDate(job.dueDate, 'medium')}</div>
      ),
      sortable: true,
    },
    {
      key: 'actions',
      title: '',
      align: 'right' as const,
      render: (_: unknown, job: SingleJob) => (
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

        <BaseTable<SingleJob>
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
