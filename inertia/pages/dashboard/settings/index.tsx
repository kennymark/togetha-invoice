import { SEO } from '~/components/seo'
import { PageHeader } from '../_components/page-header'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import type { UserData } from '~/models/user.model'
import { BaseCard } from '~/components/reusable/base-card'
import { FormBase, FormField } from '~/components/reusable'
import { router } from '@inertiajs/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface Props {
  user: UserData
}

const userFormSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  secondaryEmail: z.string().email().optional().or(z.literal('')),
  contactNumber: z.string().min(1),
})

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(1),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type UserFormValues = z.infer<typeof userFormSchema>
type PasswordFormValues = z.infer<typeof passwordFormSchema>

export default function SettingsPage({ user }: Props) {
  const profileForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
      secondaryEmail: user.secondaryEmail || '',
      contactNumber: user.contactNumber,
    },
  })

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const handleProfileSubmit = (data: UserFormValues) => {
    router.put('/users/settings', data)
  }

  const handlePasswordSubmit = (data: PasswordFormValues) => {
    router.put('/users/password', data)
  }

  return (
    <>
      <SEO title='Settings' description='Configure your account and application preferences.' />
      <PageHeader
        title='Settings'
        description='Configure your account and application preferences.'
      />
      <div className='grid grid-cols-1  gap-8 w-full '>
        <BaseCard
          title='Profile Information'
          description="Update your account's profile information.">
          <FormBase form={profileForm} onSubmit={handleProfileSubmit}>
            <div className=' grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField form={profileForm} name='fullName' label='Full Name' showMessage>
                <Input placeholder='Enter your full name' />
              </FormField>

              <FormField form={profileForm} name='email' label='Email' showMessage>
                <Input type='email' placeholder='Enter your email' />
              </FormField>

              <FormField form={profileForm} name='secondaryEmail' label='Secondary Email'>
                <Input type='email' placeholder='Enter your secondary email' />
              </FormField>

              <FormField form={profileForm} name='contactNumber' label='Contact Number' showMessage>
                <Input placeholder='Enter your contact number' />
              </FormField>
            </div>
            <div className='flex justify-end'>
              <Button type='submit'>Save Changes</Button>
            </div>
          </FormBase>
        </BaseCard>

        <BaseCard
          title='Update Password'
          description='Ensure your account is using a secure password.'>
          <FormBase form={passwordForm} onSubmit={handlePasswordSubmit}>
            <FormField
              form={passwordForm}
              name='currentPassword'
              label='Current Password'
              showMessage>
              <Input type='password' placeholder='Enter your current password' />
            </FormField>
            <div className=' grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField form={passwordForm} name='newPassword' label='New Password' showMessage>
                <Input type='password' placeholder='Enter your new password' />
              </FormField>

              <FormField
                form={passwordForm}
                name='confirmPassword'
                label='Confirm New Password'
                showMessage>
                <Input type='password' placeholder='Confirm your new password' />
              </FormField>
            </div>
            <div className='flex justify-end mt-auto'>
              <Button type='submit'>Update Password</Button>
            </div>
          </FormBase>
        </BaseCard>
      </div>
    </>
  )
}
