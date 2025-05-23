import { EmailButton, EmailSection, EmailText, EmailWrapper } from '#emails/layout/layout'

interface ResetRequestEmailProps {
  resetUrl: string
  user: { fullName: string }
}

export default function ResetRequestEmail({ resetUrl, user }: ResetRequestEmailProps) {
  return (
    <EmailWrapper preview='Password reset request for your Togetha account'>
      <EmailSection>
        <EmailText>Hello {user.fullName || 'User'},</EmailText>
        <EmailText>
          You requested a password reset. Click the button below to reset your password:
        </EmailText>
        <EmailButton href={resetUrl}>Reset Password</EmailButton>
        <EmailText>If you did not request this, you can ignore this email.</EmailText>
        <EmailText>
          Thanks,
          <br />
          The Togetha Team
        </EmailText>
      </EmailSection>
    </EmailWrapper>
  )
}

ResetRequestEmail.defaultProps = {
  resetUrl: 'https://example.com/reset-password',
  user: { fullName: 'Jason Stackhouse' },
}
