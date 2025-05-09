import Invoice from '#models/invoice'
import { validateQueryParams } from '#utils/vine'
import { createInvoiceValidator, updateInvoiceValidator } from '#validators/invoice_validator'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class InvoicesController {
  async createInvoice({ auth, request, logger }: HttpContext) {
    const trx = await db.transaction()
    try {
      const body = await request.validateUsing(createInvoiceValidator)
      await Invoice.create({ ...body, userId: auth.user?.id }, { client: trx })
      await trx.commit()
      logger.info(`Invoice created: ${body.title}`)
      return { message: 'Invoice created successfully' }
    } catch (e) {
      await trx.rollback()
      logger.error(e)
      throw e
    }
  }

  async dashboard() {
    const totalInvoices = await Invoice.query().getCount()
    const overdueInvoices = await Invoice.query().where('due_date', '<', new Date()).getCount()
    return { totalInvoices, overdueInvoices }
  }

  async getAll({ request }: HttpContext) {
    const {
      page = 1,
      perPage = 10,
      startDate,
      endDate,
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = await validateQueryParams(request.qs())
    const invoices = await Invoice.query()
      .betweenCreatedDates(startDate, endDate)
      .sortBy(sortBy, sortOrder)
      .paginate(page, perPage)
    return invoices
  }

  async getById({ params }: HttpContext) {
    const invoice = await Invoice.findOrFail(params.id)
    return invoice
  }

  async update({ request, params }: HttpContext) {
    const body = await request.validateUsing(updateInvoiceValidator)
    const invoice = await Invoice.findOrFail(params.id)
    invoice.merge(body)
    await invoice.save()
  }

  async delete({ params }: HttpContext) {
    const invoice = await Invoice.findOrFail(params.id)
    await invoice.delete()
    return { message: 'Invoice deleted successfully' }
  }
}
