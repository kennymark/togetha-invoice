import EmailLayout from '#emails/layout'
import { Section, Text } from '@react-email/components'

interface ResetSuccessEmailProps {
  user: { fullName: string }
}

export default function ResetSuccessEmail({ user }: ResetSuccessEmailProps) {
  return (
    <EmailLayout preview='Your Togetha password was reset'>
      <Section>
        <Text>Hello {user.fullName || 'User'},</Text>
        <Text>Your password has been successfully reset. You can now log in with your new password.</Text>
        <Text>If you did not perform this action, please contact support immediately.</Text>
        <Text>
          Thanks,
          <br />
          The Togetha Team
        </Text>
      </Section>
    </EmailLayout>
  )
}

ResetSuccessEmail.defaultProps = {
  user: { fullName: 'Jason Stackhouse' },
}
