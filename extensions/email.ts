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
      loginUrl: string
      user: {
        fullName: string
      }
    }

    'invoice-created': {
      subject: string
      email: string
      invoice: {
        recipientName: string
        invoiceNumber: string
        invoiceDate: string
        dueDate: string
        amount: string
        currency: string
        paymentUrl: string
        createdAt: string
        items: Array<{
          description: string
          quantity: number
          unitPrice: string
          amount: string
        }>
        companyName: string
        companyAddress: string
      }
    }
  }
}
