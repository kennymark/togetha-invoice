import EmailLayout from '#emails/layout'
import { Button, Section, Text } from '@react-email/components'

interface ResetRequestEmailProps {
  resetUrl: string
  user: { fullName: string }
}

export default function ResetRequestEmail({ resetUrl, user }: ResetRequestEmailProps) {
  return (
    <EmailLayout preview='Password reset request for your Togetha account'>
      <Section>
        <Text>Hello {user.fullName || 'User'},</Text>
        <Text>You requested a password reset. Click the button below to reset your password:</Text>
        <Button href={resetUrl} className='bg-brand text-white px-4 py-2 rounded-md'>
          Reset Password
        </Button>
        <Text>If you did not request this, you can ignore this email.</Text>
        <Text>
          Thanks,
          <br />
          The Togetha Team
        </Text>
      </Section>
    </EmailLayout>
  )
}

ResetRequestEmail.defaultProps = {
  resetUrl: 'https://example.com/reset-password',
  user: { fullName: 'Jason Stackhouse' },
}
