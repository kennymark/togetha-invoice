declare module '@adonisjs/core/types' {
  interface Emails {
    'forgot-password': {
      subject: string
      email: string
      resetUrl: string
      user: {
        fullName: string
      }
    }
    'reset-password': {
      subject: string
      email: string
      user: {
        fullName: string
      }
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
    'signup-success': {
      subject: string
      email: string
      link: string
      user: {
        fullName: string
      }
    }
  }
}
