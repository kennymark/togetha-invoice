import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormBase, FormBaseHeader, FormField, BaseSelect } from '~/components/reusable'
import { Input, Button, DatePicker, Textarea } from '~/components/ui'
import { SEO } from '~/components/seo'
import { PageHeader } from '../../_components/page-header'
import { z } from 'zod'

const jobFormSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  customer: z.string().min(1, 'Customer is required'),
  category: z.string().min(1, 'Category is required'),
  status: z.string().min(1, 'Status is required'),
  priority: z.string().min(1, 'Priority is required'),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.date({
    required_error: 'Due date is required',
  }),
})

type JobFormValues = z.infer<typeof jobFormSchema>

const categoryOptions = [
  { value: 'electric', label: 'Electric' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'carpentry', label: 'Carpentry' },
  { value: 'painting', label: 'Painting' },
  { value: 'other', label: 'Other' },
]

const statusOptions = [
  { value: 'todo', label: 'Todo' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const customerOptions = [
  { value: 'tolu@togetha.co.uk', label: 'Tolu - tolulope@togetha.co.uk' },
  // Add more customers as needed
]

export default function JobsCreatePage() {
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: '',
      customer: '',
      category: '',
      status: 'todo',
      priority: 'medium',
      description: '',
      dueDate: new Date(),
    },
  })

  function handleSubmit(data: JobFormValues) {
    console.log('job data', data)
    // TODO: Implement submission logic
    // e.g., call API, show notification, etc.
  }

  return (
    <>
      <SEO title='Add Job' description='Add new jobs and start managing their progress' />
      <PageHeader title='Add a Job' description='Add new jobs and start managing their progress' />
      <div className='flex flex-col gap-8 w-full'>
        <FormBase form={form} onSubmit={handleSubmit} className='space-y-7'>
          <FormBaseHeader title='Job details' />
          <div className='grid grid-cols-1 gap-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField form={form} name='title' label='Job title' showMessage>
                <Input placeholder='Faulty kitchen sink' />
              </FormField>

              <FormField form={form} name='customer' label='Select customer' showMessage>
                <BaseSelect
                  placeholder='Select a customer'
                  items={customerOptions}
                  onChange={(value) => form.setValue('customer', value)}
                  value={form.watch('customer')}
                />
              </FormField>
              <FormField form={form} name='category' label='Category' showMessage>
                <BaseSelect
                  placeholder='Select category'
                  items={categoryOptions}
                  onChange={(value) => form.setValue('category', value)}
                  value={form.watch('category')}
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

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField form={form} name='status' label='Status' showMessage>
                <BaseSelect
                  placeholder='Select status'
                  items={statusOptions}
                  onChange={(value) => form.setValue('status', value)}
                  value={form.watch('status')}
                />
              </FormField>

              <FormField form={form} name='priority' label='Priority' showMessage>
                <BaseSelect
                  placeholder='Select priority'
                  items={priorityOptions}
                  onChange={(value) => form.setValue('priority', value)}
                  value={form.watch('priority')}
                />
              </FormField>
            </div>

            <FormField form={form} name='description' label='Describe the issue' showMessage>
              <Textarea placeholder='Description' className='min-h-[100px]' />
            </FormField>

            <div>
              <label htmlFor='image-upload' className='block text-sm font-medium mb-1'>
                Attach images (optional)
              </label>
              <div className='border-2 border-dashed rounded-lg p-8 text-center'>
                <input id='image-upload' type='file' multiple accept='image/*' className='hidden' />
                <label
                  htmlFor='image-upload'
                  className='cursor-pointer text-blue-600 hover:text-blue-700'>
                  Drag & drop images here or click to upload
                </label>
              </div>
            </div>
          </div>

          <Button type='submit' className='px-8 self-start'>
            Create job
          </Button>
        </FormBase>
      </div>
    </>
  )
}
