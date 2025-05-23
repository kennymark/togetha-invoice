import { EmailButton, EmailHeading, EmailText, EmailWrapper } from '#emails/layout/layout'

interface SignupSuccessEmailProps {
  user: {
    fullName: string
  }
  loginUrl: string
}

export default function SignupSuccessEmail({ user, loginUrl }: SignupSuccessEmailProps) {
  return (
    <EmailWrapper preview='Welcome to Togetha Invoice! Your account has been created successfully.'>
      <EmailHeading>Welcome to Togetha Invoice!</EmailHeading>

      <EmailText>Hi {user.fullName},</EmailText>

      <EmailText>
        Thank you for signing up with Togetha Invoice! We're excited to have you on board. Your
        account has been created successfully.
      </EmailText>

      <EmailText>
        You can now log in to your account and start managing your invoices and payments.
      </EmailText>

      <EmailButton href={loginUrl}>Log in to your account</EmailButton>

      <EmailText>
        If you have any questions or need assistance, please don't hesitate to contact our support
        team.
      </EmailText>
    </EmailWrapper>
  )
}

SignupSuccessEmail.defaultProps = {
  user: {
    fullName: 'John Doe',
  },
  loginUrl: 'https://example.com/login',
}
