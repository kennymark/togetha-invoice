import InvoiceEmail from '#emails/invoice'
import ResetRequestEmail from '#emails/reset_request'
import ResetSuccessEmail from '#emails/reset_success'
import SignupSuccessEmail from '#emails/signup-success'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'
import type { Emails } from '@adonisjs/core/types'
import type { Message } from '@adonisjs/mail'
import mail from '@adonisjs/mail/services/main'
import { render } from '@react-email/components'

const NO_REPLY_EMAIL = env.get('NO_REPLY_EMAIL')

type EmailHandlerFunction<T extends keyof Emails = keyof Emails> = (
  message: Message,
  data: Emails[T],
  options: Record<string, unknown>,
) => Promise<void>

class EmailService {
  public static listeners = new Map<keyof Emails, EmailHandlerFunction>()

  static on<T extends keyof Emails>(type: T, handler: EmailHandlerFunction<T>) {
    EmailService.listeners.set(type, handler as EmailHandlerFunction)
  }

  static async send<T extends keyof Emails>(
    emailType: T,
    data: Emails[T],
    options: Record<string, unknown> = {},
  ) {
    const handler = EmailService.listeners.get(emailType) as EmailHandlerFunction<T> | undefined
    if (!handler) {
      throw new Error(`No handler registered for email type: ${String(emailType)}`)
    }

    try {
      logger.debug('Preparing to send email', {
        type: emailType,
        data: {
          ...data,
        },
      })

      await mail.sendLater(async (message) => {
        await Promise.resolve(handler(message, data, options))
      })

      logger.info(`Email queued successfully: ${emailType}`, {
        to: data.email,
        from: NO_REPLY_EMAIL,
        subject: data.subject,
      })
    } catch (error) {
      logger.error(`Failed to queue email: ${emailType}`, {
        error,
        to: data.email,
        from: NO_REPLY_EMAIL,
        subject: data.subject,
      })
      throw error
    }
  }
}

EmailService.on('invoice-created', async (message, data: Emails['invoice-created']) => {
  console.log('data', data)
  const { email, subject, invoice } = data
  const html = await render(InvoiceEmail({ ...invoice }))
  message.subject(subject).from(NO_REPLY_EMAIL).to(email).html(html)
})

EmailService.on('signup-success', async (message, data: Emails['signup-success']) => {
  const { email, subject, loginUrl, user } = data
  const html = await render(SignupSuccessEmail({ loginUrl, user }))
  message.subject(subject).from(NO_REPLY_EMAIL).to(email).html(html)
})

EmailService.on('reset-password', async (message, data: Emails['reset-password']) => {
  const { email, subject, user } = data
  const html = await render(ResetSuccessEmail({ user }))
  message.subject(subject).from(NO_REPLY_EMAIL).to(email).html(html)
})

EmailService.on('forgot-password', async (message, data: Emails['forgot-password']) => {
  const { email, subject, resetUrl, user } = data
  console.log('data', data)
  const html = await render(ResetRequestEmail({ resetUrl, user }))
  message.subject(subject).from(NO_REPLY_EMAIL).to(email).html(html)
})

EmailService.on('simple-send', async (message, data: Emails['simple-send']) => {
  const { subject, from, email, name, replyTo, html } = data
  message.subject(subject)
  message.from(from || NO_REPLY_EMAIL)
  message.to(email, name)
  message.replyTo(replyTo || '')
  message.html(html)
})

export default EmailService
