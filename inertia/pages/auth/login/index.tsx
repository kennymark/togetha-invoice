import { useForm } from 'react-hook-form'
import { Input, Button, Card } from '~/components/ui'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormBase, FormField } from '~/components/reusable/base-form'
import { getRoutePath } from '~/config/get-route-path'
import { router } from '@inertiajs/react'
import { SEO } from '~/components/seo'
import FlashMessages from '~/components/flash-messages'

const formSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormValues = z.infer<typeof formSchema>

function Login() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    router.post('/login', values)
  }

  return (
    <>
      <FlashMessages />
      <SEO title='Login' description='Login to your account' />
      <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 w-full'>
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Sign in to your account
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Or{' '}
            <Button
              type='button'
              onClick={() => router.visit(getRoutePath('auth_create_account'))}
              variant='link'
              className='font-medium text-blue-600 hover:text-blue-500'>
              Create a new account
            </Button>
          </p>
        </div>

        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
          <Card className='p-6'>
            <FormBase form={form} onSubmit={onSubmit} className='space-y-6'>
              <FormField form={form} name='email' label='Email' showMessage>
                <Input type='email' placeholder='john@example.com' />
              </FormField>

              <FormField form={form} name='password' label='Password' showMessage>
                <Input type='password' placeholder='••••••••' />
              </FormField>

              <Button type='submit' className='w-full'>
                Sign in
              </Button>
            </FormBase>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Login
