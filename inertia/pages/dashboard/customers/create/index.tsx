import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormBase, FormField, BaseSelect, FormBaseHeader } from '~/components/reusable'
import { Input } from '~/components/ui/input'
import { SEO } from '~/components/seo'
import { PageHeader } from '../../_components/page-header'
import { Button } from '~/components/ui'
import { customerFormSchema, type CustomerFormValues } from '~/lib/schemas/customer'

const countryOptions = [
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ng', label: 'Nigeria' },
  { value: 'us', label: 'United States' },
  // Add more as needed
]

export default function CustomersCreatePage() {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      businessName: '',
      address: '',
      state: '',
      postCode: '',
      city: '',
      country: '',
    },
  })

  // const { mutate: createCustomer, isPending } = useMutation({
  //   mutationFn: customersService.createCustomer,
  //   onSuccess: () => {
  //     toast.success('Customer created successfully')
  //     form.reset()
  //     navigate(getRoutePath('dashboard_customers'))
  //   },
  //   onError: () => {
  //     toast.error('Failed to create customer')
  //   },
  // })

  function handleSubmit(data: CustomerFormValues) {
    console.log(data)
    // createCustomer(data)
  }

  return (
    <>
      <SEO
        title='Add Customer'
        description='Add new customers and start managing their jobs and payments'
      />
      <PageHeader
        title='Add Customer'
        description='Add new customers and start managing their jobs and payments'
      />
      <div className='flex flex-col gap-8 w-full'>
        <FormBase form={form} onSubmit={handleSubmit} className='space-y-7'>
          <FormBaseHeader title='Basic information' />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <FormField form={form} name='fullName' label='Full name' showMessage>
              <Input placeholder='Emmanuel Kingsley' />
            </FormField>
            <FormField form={form} name='email' label='Email' showMessage>
              <Input type='email' placeholder='ee@yahoo.com' />
            </FormField>
            <FormField form={form} name='phone' label='Phone number' showMessage>
              <Input placeholder='+44 448 672 383 5' />
            </FormField>
            <FormField form={form} name='address' label='Address line' showMessage>
              <Input placeholder='…' />
            </FormField>
            <FormField form={form} name='postCode' label='Post code' showMessage>
              <Input placeholder='…' />
            </FormField>
            <FormField form={form} name='state' label='State' showMessage>
              <Input placeholder='…' />
            </FormField>
            <FormField form={form} name='city' label='City' showMessage>
              <Input placeholder='…' />
            </FormField>
            <FormField form={form} name='country' label='Country' showMessage>
              <BaseSelect
                placeholder='…'
                items={countryOptions}
                onChange={(value) => form.setValue('country', value)}
                value={form.watch('country')}
              />
            </FormField>
            <FormField form={form} name='businessName' label='Business name (optional)' showMessage>
              <Input placeholder='Cleaning services' />
            </FormField>
            <FormField
              form={form}
              name='businessAddress'
              label='Business address (optional)'
              showMessage>
              <Input placeholder='…' />
            </FormField>
          </div>

          <Button type='submit' className='px-8 self-start'>
            Add customer
          </Button>
        </FormBase>
      </div>
    </>
  )
}
