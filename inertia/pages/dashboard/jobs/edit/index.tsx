import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormBase, FormField, BaseSelect, FormBaseHeader } from '~/components/reusable'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { DatePicker } from '~/components/ui/date-picker'
import { SEO } from '~/components/seo'
import { PageHeader } from '../../_components/page-header'
import { Button } from '~/components/ui'
import { router } from '@inertiajs/react'
import type { JobFormValues } from '~/lib/schemas/jobs'
import { jobFormSchema } from '~/lib/schemas/jobs'
import type { SingleJob } from '~/models/jobs.model'

interface Customer {
  id: string
  fullName: string
}

interface EditJobPageProps {
  job: SingleJob
  customers: Customer[]
}

export default function EditJobPage({ job, customers }: EditJobPageProps) {
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: job.title,
      description: job.description,
      category: job.category,
      customerId: job.customerId,
      priority: job.priority,
      status: job.status,
      dueDate: new Date(job.dueDate),
    },
  })

  console.log('initial data', job)

  function handleSubmit(data: JobFormValues) {
    console.log(data)
    router.put(`/jobs/${job.id}`, data)
  }

  return (
    <>
      <SEO title='Edit Job' description='Edit job details.' />
      <PageHeader
        title='Edit Job'
        description='Edit job details.'
        hasBackButton
        backLink='/dashboard/jobs'
      />
      <div className='flex flex-col gap-8 w-full'>
        <FormBase form={form} onSubmit={handleSubmit} className='space-y-7'>
          <FormBaseHeader title='Job details' />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <FormField form={form} name='title' label='Job title' showMessage>
              <Input placeholder='Faulty kitchen sink' />
            </FormField>

            <FormField form={form} name='customerId' label='Select customer' showMessage>
              <BaseSelect
                placeholder='Select a customer'
                items={customers.map((customer) => ({
                  label: customer.fullName,
                  value: customer.id,
                }))}
                onChange={(value) => form.setValue('customerId', value)}
                value={form.watch('customerId')}
              />
            </FormField>

            <FormField form={form} name='category' label='Category' showMessage>
              <Input placeholder='Plumbing' />
            </FormField>

            <FormField form={form} name='priority' label='Priority' showMessage>
              <BaseSelect
                placeholder='Select priority'
                items={[
                  { label: 'Low', value: 'low' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'High', value: 'high' },
                ]}
                onChange={(value) => form.setValue('priority', value as JobFormValues['priority'])}
                value={form.watch('priority')}
              />
            </FormField>

            <FormField form={form} name='status' label='Status' showMessage>
              <BaseSelect
                placeholder='Select status'
                items={[
                  { label: 'Pending', value: 'pending' },
                  { label: 'Completed', value: 'completed' },
                  { label: 'Cancelled', value: 'cancelled' },
                ]}
                onChange={(value) => form.setValue('status', value as JobFormValues['status'])}
                value={form.watch('status')}
              />
            </FormField>

            <FormField form={form} name='dueDate' label='Due date' showMessage>
              <DatePicker
                date={form.watch('dueDate')}
                onSelect={(date) => date && form.setValue('dueDate', date)}
                placeholder='Select due date'
              />
            </FormField>
          </div>

          <FormField form={form} name='description' label='Description' showMessage>
            <Textarea placeholder='Describe the job details...' className='min-h-[100px]' />
          </FormField>

          <Button type='submit' className='px-8 self-start'>
            Update job
          </Button>
        </FormBase>
      </div>
    </>
  )
}
