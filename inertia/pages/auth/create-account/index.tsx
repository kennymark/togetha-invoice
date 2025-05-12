import { useForm } from 'react-hook-form'
import { Input, Button, Card } from '~/components/ui'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormBase, FormField } from '~/components/reusable/base-form'

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

  // const { mutate: createAccount, isPending: isCreatingAccount } = useMutation({
  //   mutationFn: (values: FormValues) => authService.createAccount(values),
  //   onSuccess: () => {
  //     toast.success('Account created successfully')
  //     navigate(getRoutePath('auth_login'))
  //   },
  //   onError: (error) => {
  //     toast.error(error.message)
  //   },
  // })

  const onSubmit = async (values: FormValues) => {
    console.log(values)
    // createAccount(values)
  }

  return (
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
              <Input type='tel' placeholder='+1 (555) 000-0000' />
            </FormField>

            <Button type='submit' className='w-full'>
              Create Account
            </Button>
          </FormBase>
        </Card>
      </div>
    </div>
  )
}

export default CreateAccount
