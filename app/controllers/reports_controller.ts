import Customer from '#models/customer'
import Invoice from '#models/invoice'
import Job from '#models/job'
import Payment from '#models/payment'
import ReportService from '#services/report_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class ReportsController {
  async cutsomersExport({ request, auth, logger }: HttpContext) {
    const { sort } = request.qs()
    const sortOrder = sort || 'desc'
    const customers = await Customer.query().orderBy('created_at', sortOrder)
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
    const { metadata } = await ReportService.exportCSV({
      data: parsedCustomer,
      name: 'customers',
      logger,
      user: auth.user!,
      description,
    })
    return metadata
  }

  async jobsExport({ request, auth, logger }: HttpContext) {
    const { sort } = request.qs()
    const sortOrder = sort || 'desc'
    const jobs = await Job.query().orderBy('created_at', sortOrder).preload('customer')
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
    const { metadata } = await ReportService.exportCSV({
      data: parsedJobs,
      name: 'jobs',
      logger,
      user: auth.user!,
      description,
    })
    return metadata
  }

  async invoicesExport({ request, auth, logger }: HttpContext) {
    const { sort } = request.qs()
    const sortOrder = sort || 'desc'
    const invoices = await Invoice.query().orderBy('created_at', sortOrder).preload('customer')
    const parsedInvoices = invoices.map((invoice) => ({
      'Invoice Number': invoice.invoiceNumber,
      'Customer Name': invoice.customer.fullName,
      'Customer Email': invoice.customer.email,
      'Customer Phone': invoice.customer.phone,
      'Created At': invoice.createdAt,
    }))
    const description = `Export of invoices table with parameters of Sort: ${sort}`
    const { metadata } = await ReportService.exportCSV({
      data: parsedInvoices,
      name: 'invoices',
      logger,
      user: auth.user!,
      description,
    })
    return metadata
  }

  async paymentsExport({ request, auth, logger }: HttpContext) {
    const { sort } = request.qs()
    const sortOrder = sort || 'desc'
    const payments = await Payment.query().orderBy('created_at', sortOrder).preload('customer')
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
    const { metadata } = await ReportService.exportCSV({
      data: parsedPayments,
      name: 'payments',
      logger,
      user: auth.user!,
      description,
    })
    return metadata
  }
}
