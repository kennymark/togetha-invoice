import { SEO } from '~/components/seo'
import { Badge } from '~/components/ui'
import { formatDate } from '~/lib/helpers'
import type { SingleJob } from '~/models/jobs.model'
import { DetailsLayout } from '~/components/reusable/details-layout'
import { DetailsValue } from '~/components/details-value'
import { getRoutePath } from '~/config/get-route-path'
import { router } from '@inertiajs/react'
import { useDisclosure } from '~/hooks/use-disclosure'
import { ConfirmationDialog } from '~/components/reusable'

const priorityVariantMap: Record<string, 'low' | 'medium' | 'high'> = {
  low: 'low',
  medium: 'medium',
  high: 'high',
}

const statusVariantMap: Record<string, 'todo' | 'completed' | 'high'> = {
  pending: 'todo',
  completed: 'completed',
  cancelled: 'high',
}

export default function JobDetailsPage({ job }: { job: SingleJob }) {
  const { isOpen, onToggle } = useDisclosure()

  const actions = [
    {
      name: `Mark as ${job.status === 'pending' ? 'completed' : 'pending'}`,
      onClick: () => router.put(`/jobs/${job.id}/mark-as-completed-or-uncompleted`),
    },
    {
      name: 'Create invoice',
      onClick: () => router.visit(getRoutePath('dashboard_invoices_create')),
    },
    {
      name: 'Delete job',
      onClick: () => {
        onToggle()
      },
    },
  ]

  return (
    <>
      <ConfirmationDialog
        isOpen={isOpen}
        onToggle={onToggle}
        title='Delete job'
        description='Are you sure you want to delete this job?'
        onConfirm={() => {
          router.delete(`/jobs/${job.id}`)
        }}
      />
      <SEO title='Job details' description='View and manage all your assigned job' />
      <DetailsLayout
        title='Job details'
        description='View and manage all your assigned job'
        hasBackButton
        backLink={getRoutePath('dashboard_jobs')}
        actions={actions}>
        <DetailsValue label='Job title' className='mb-10'>
          <span className='text-xl'>{job.title}</span>
        </DetailsValue>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <DetailsValue label='Customer'>
            {job.customer.fullName} - {job.customer.email}
          </DetailsValue>
          <DetailsValue label='Address'>{job.customer.address}</DetailsValue>
          <DetailsValue label='Category'>{job.category}</DetailsValue>
          <DetailsValue label='Created at'>{formatDate(job.createdAt, 'full')}</DetailsValue>
          <DetailsValue label='Job status'>
            <Badge variant={statusVariantMap[job.status] || 'todo'}>{job.status}</Badge>
          </DetailsValue>
          <DetailsValue label='Priority'>
            <Badge variant={priorityVariantMap[job.priority] || 'low'}>{job.priority}</Badge>
          </DetailsValue>
        </div>
        <div className='mb-6'>
          <DetailsValue label='Description'>{job.description}</DetailsValue>
        </div>
      </DetailsLayout>
    </>
  )
}
