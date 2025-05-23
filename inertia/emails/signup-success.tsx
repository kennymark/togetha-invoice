import EmailLayout from '#emails/layout'
import { Button, Heading, Text } from '@react-email/components'

interface SignupSuccessEmailProps {
  user: {
    fullName: string
  }
  loginUrl: string
}

export default function SignupSuccessEmail({ user, loginUrl }: SignupSuccessEmailProps) {
  return (
    <EmailLayout preview='Welcome to Togetha Invoice! Your account has been created successfully.'>
      <Heading style={{ color: '#007291', marginBottom: '24px' }}>
        Welcome to Togetha Invoice!
      </Heading>

      <Text style={{ marginBottom: '16px' }}>Hi {user.fullName},</Text>

      <Text style={{ marginBottom: '16px' }}>
        Thank you for signing up with Togetha Invoice! We're excited to have you on board. Your
        account has been created successfully.
      </Text>

      <Text style={{ marginBottom: '24px' }}>
        You can now log in to your account and start managing your invoices and payments.
      </Text>

      <Button
        href={loginUrl}
        style={{
          background: '#007291',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '6px',
          textDecoration: 'none',
          display: 'inline-block',
        }}>
        Log in to your account
      </Button>

      <Text style={{ marginTop: '24px', fontSize: '14px', color: '#666' }}>
        If you have any questions or need assistance, please don't hesitate to contact our support
        team.
      </Text>
    </EmailLayout>
  )
}

SignupSuccessEmail.defaultProps = {
  user: {
    fullName: 'John Doe',
  },
  loginUrl: 'https://example.com/login',
}
