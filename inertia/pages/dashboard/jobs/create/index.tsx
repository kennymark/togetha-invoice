import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormBase, FormField, BaseSelect, FormBaseHeader } from '~/components/reusable'
import { Input, Button, Textarea, DatePicker } from '~/components/ui'
import { SEO } from '~/components/seo'
import { PageHeader } from '../../_components/page-header'
import { router } from '@inertiajs/react'
import { FakeDataGenerator } from '~/components/dev/fake-data-generator'
import { jobFormSchema, type JobFormValues } from '~/lib/schemas/jobs'
import useQueryParams from '~/hooks/use-query-params'

interface Customer {
  id: string
  fullName: string
}

interface CreateJobPageProps {
  customers: Customer[]
}

export default function CreateJobPage({ customers }: CreateJobPageProps) {
  const { customerId } = useQueryParams()

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      customerId: customerId || '',
      priority: 'low',
      status: 'pending',
      dueDate: new Date().toISOString(),
    },
  })

  const onSubmit = (data: JobFormValues) => {
    router.post('/jobs', data)
  }

  return (
    <>
      <SEO title='Create Job' description='Create a new job.' />
      <div className='space-y-6'>
        <PageHeader
          title='Create Job'
          description='Create a new job.'
          hasBackButton
          backLink='/dashboard/jobs'
        />
        <FormBase form={form} onSubmit={onSubmit}>
          <div className='space-y-6'>
            <FakeDataGenerator type='job' onGenerate={form.reset} className='px-4' />
            <FormBaseHeader title='Job details' />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField form={form} name='title' label='Title' showError>
                <Input placeholder='Enter job title' />
              </FormField>

              <FormField form={form} name='category' label='Category' showError>
                <Input placeholder='Enter job category' />
              </FormField>

              <FormField form={form} name='customerId' label='Customer' showError>
                <BaseSelect
                  placeholder='Select customer'
                  items={customers.map((customer) => ({
                    label: customer.fullName,
                    value: customer.id,
                  }))}
                  onChange={(value) => form.setValue('customerId', value)}
                  value={form.watch('customerId')}
                />
              </FormField>

              <FormField form={form} name='priority' label='Priority' showError>
                <BaseSelect
                  placeholder='Select priority'
                  items={[
                    { label: 'Low', value: 'low' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'High', value: 'high' },
                  ]}
                  onChange={(value) =>
                    form.setValue('priority', value as JobFormValues['priority'])
                  }
                  value={form.watch('priority')}
                />
              </FormField>

              <FormField form={form} name='status' label='Status' showError>
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
                  onSelect={(date) => form.setValue('dueDate', date || new Date().toISOString())}
                  placeholder='Select due date'
                />
              </FormField>
            </div>

            <FormField form={form} name='description' label='Description' showError>
              <Textarea placeholder='Describe the job details...' className='min-h-[100px]' />
            </FormField>

            <Button type='submit' className='px-8 self-start'>
              Create job
            </Button>
          </div>
        </FormBase>
      </div>
    </>
  )
}
