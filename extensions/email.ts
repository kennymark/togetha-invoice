declare module '@adonisjs/core/types' {
  interface Emails {
    'forgot-password': {
      subject: string
      email: string
      html: string
    }
    'reset-password': {
      subject: string
      email: string
      html: string
    }
    'simple-send': {
      subject: string
      email: string
      body: string
      from?: string
      replyTo?: string
      name?: string
      html: string
    }
  }
}
