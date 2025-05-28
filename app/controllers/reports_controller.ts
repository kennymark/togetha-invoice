import Customer from '#models/customer'
import Invoice from '#models/invoice'
import Job from '#models/job'
import Payment from '#models/payment'
import ReportService from '#services/report_service'
import type { HttpContext } from '@adonisjs/core/http'
import type { ModelObject } from '@adonisjs/lucid/types/model'

export default class ReportsController {
  private async handleExport(
    data: ModelObject[],
    name: string,
    description: string,
    { auth, logger, response }: HttpContext,
  ) {
    try {
      const { metadata } = await ReportService.exportCSV({
        data,
        name,
        logger,
        user: auth.user!,
        description,
      })

      const successMessage = `${name.charAt(0).toUpperCase() + name.slice(1)} exported successfully`
      return response.json({ metadata, message: successMessage })
    } catch (error) {
      logger.error(error)
      const errorMessage = `Failed to export ${name}`
      return response.status(500).json({ message: errorMessage })
    }
  }

  async customersExport(context: HttpContext) {
    const { request, auth } = context
    const { sort } = request.body()
    const sortOrder = sort || 'desc'
    const customers = await Customer.query()
      .where('user_id', auth.user!.id)
      .orderBy('created_at', sortOrder)
    const parsedCustomer = customers.map((customer) => ({
      Name: customer.fullName,
      Email: customer.email,
      Phone: customer.phone,
      Address: customer.address,
      City: customer.city,
      State: customer.state,
      'Created At': customer.createdAt,
    }))
    const description = `Export of customers table with parameters of Sort: ${sort}`
    return this.handleExport(parsedCustomer, 'customers', description, context)
  }

  async jobsExport(context: HttpContext) {
    const { request, auth } = context
    const { sort } = request.qs()
    const sortOrder = sort || 'desc'
    const jobs = await Job.query()
      .where('user_id', auth.user!.id)
      .orderBy('created_at', sortOrder)
      .preload('customer')
    const parsedJobs = jobs.map((job) => ({
      Title: job.title,
      Description: job.description,
      Category: job.category,
      Status: job.status,
      Priority: job.priority,
      DueDate: job.dueDate,
      'Customer Name': job.customer.fullName,
      'Customer Email': job.customer.email,
      'Customer Phone': job.customer.phone,
      'Created At': job.createdAt,
    }))
    const description = `Export of jobs table with parameters of Sort: ${sort}`
    return this.handleExport(parsedJobs, 'jobs', description, context)
  }

  async invoicesExport(context: HttpContext) {
    const { request, auth } = context
    const { sort } = request.qs()
    const sortOrder = sort || 'desc'
    const invoices = await Invoice.query()
      .where('user_id', auth.user!.id)
      .orderBy('created_at', sortOrder)
      .preload('customer')
    const parsedInvoices = invoices.map((invoice) => ({
      'Invoice Number': invoice.invoiceNumber,
      'Customer Name': invoice.customer.fullName,
      'Customer Email': invoice.customer.email,
      'Customer Phone': invoice.customer.phone,
      'Created At': invoice.createdAt,
    }))
    const description = `Export of invoices table with parameters of Sort: ${sort}`
    return this.handleExport(parsedInvoices, 'invoices', description, context)
  }

  async paymentsExport(context: HttpContext) {
    const { request, auth } = context
    const { sort } = request.qs()
    const sortOrder = sort || 'desc'
    const payments = await Payment.query()
      .where('user_id', auth.user!.id)
      .orderBy('created_at', sortOrder)
      .preload('customer')
    const parsedPayments = payments.map((payment) => ({
      'Customer Name': payment.customer.fullName,
      'Customer Email': payment.customer.email,
      'Customer Phone': payment.customer.phone,
      'Payment Date': payment.paymentDate,
      'Payment Amount': payment.amount,
      'Payment Status': payment.status,
      'Payment Method': payment.paymentMethod,
      'Payment Provider': payment.paymentProvider,
      'Payment URL': payment.paymentUrl,
      'Created At': payment.createdAt,
    }))
    const description = `Export of payments table with parameters of Sort: ${sort}`
    return this.handleExport(parsedPayments, 'payments', description, context)
  }
}
