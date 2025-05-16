import { useForm } from 'react-hook-form'
import { Input, Button, Card } from '~/components/ui'
import { PhoneInput } from '~/components/ui/phone-input'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormBase, FormField } from '~/components/reusable/base-form'
import { router } from '@inertiajs/react'
import { SEO } from '~/components/seo'
import FlashMessages from '~/components/flash-messages'

const formSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email format'),
  secondaryEmail: z.string().email('Invalid email format').optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  contactNumber: z.string().min(1, 'Contact number is required'),
})

type FormValues = z.infer<typeof formSchema>

function CreateAccount() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      secondaryEmail: '',
      password: '',
      contactNumber: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    router.post('/signup', values)
  }

  return (
    <>
      <FlashMessages />
      <SEO title='Create Account' description='Create your account' />
      <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 w-full'>
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Create your account
          </h2>
        </div>

        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
          <Card className='p-6'>
            <FormBase form={form} onSubmit={onSubmit} className='space-y-6'>
              <FormField form={form} name='fullName' label='Full Name' showMessage>
                <Input placeholder='John Doe' />
              </FormField>

              <FormField form={form} name='email' label='Email' showMessage>
                <Input type='email' placeholder='john@example.com' />
              </FormField>

              <FormField
                form={form}
                name='secondaryEmail'
                label='Secondary Email (Optional)'
                showMessage>
                <Input type='email' placeholder='secondary@example.com' />
              </FormField>

              <FormField form={form} name='password' label='Password' showMessage>
                <Input type='password' placeholder='••••••••' />
              </FormField>

              <FormField form={form} name='contactNumber' label='Contact Number' showMessage>
                <PhoneInput
                  international
                  defaultCountry='US'
                  placeholder='Enter phone number'
                  value={form.watch('contactNumber')}
                  onChange={(value) => form.setValue('contactNumber', value)}
                />
              </FormField>

              <Button type='submit' className='w-full bg-main hover:opacity-90 text-white'>
                Create Account
              </Button>
            </FormBase>
          </Card>
        </div>
      </div>
    </>
  )
}

export default CreateAccount
