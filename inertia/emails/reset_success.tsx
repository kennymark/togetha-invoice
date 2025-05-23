import { EmailSection, EmailText, EmailWrapper } from '#emails/layout/layout'

interface ResetSuccessEmailProps {
  user: { fullName: string }
}

export default function ResetSuccessEmail({ user }: ResetSuccessEmailProps) {
  return (
    <EmailWrapper preview='Your Togetha password was reset'>
      <EmailSection>
        <EmailText>Hello {user.fullName || 'User'},</EmailText>
        <EmailText>
          Your password has been successfully reset. You can now log in with your new password.
        </EmailText>
        <EmailText>
          If you did not perform this action, please contact support immediately.
        </EmailText>
        <EmailText>
          Thanks,
          <br />
          The Togetha Team
        </EmailText>
      </EmailSection>
    </EmailWrapper>
  )
}

ResetSuccessEmail.defaultProps = {
  user: { fullName: 'Jason Stackhouse' },
}
