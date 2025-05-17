import Invoice from '#models/invoice'
import Activity from '#models/activity'
import { validateQueryParams } from '#utils/vine'
import { createInvoiceValidator, updateInvoiceValidator } from '#validators/invoice_validator'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class InvoicesController {
  async createInvoice({ auth, request, logger, session, response }: HttpContext) {
    const trx = await db.transaction()
    try {
      const body = await request.validateUsing(createInvoiceValidator)
      const invoice = await Invoice.create({ ...body, userId: auth.user?.id }, { client: trx })

      await Activity.create(
        {
          userId: auth.user?.id,
          type: 'created',
          invoiceId: invoice.id,
          summary: await Activity.generateSummary('created', invoice),
        },
        { client: trx },
      )

      await trx.commit()
      logger.info(`Invoice created: ${body.title}`)
      session.flash('success', { message: 'Invoice created successfully' })
      return response.redirect().toPath('/dashboard/invoices')
    } catch (e) {
      await trx.rollback()
      logger.error(e)

      if (e.messages) {
        session.flash('errors', e.messages)
        return response.redirect().back()
      }

      throw e
    }
  }

  async dashboard() {
    const totalInvoices = await Invoice.query().getCount()
    const overdueInvoices = await Invoice.query().where('due_date', '<', new Date()).getCount()
    return { totalInvoices: totalInvoices.total, overdueInvoices: overdueInvoices.total }
  }

  async getAll({ auth, request }: HttpContext) {
    const {
      page = 1,
      perPage = 10,
      startDate,
      endDate,
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = await validateQueryParams(request.qs())
    const invoices = await Invoice.query()
      .where('user_id', auth.user!.id)
      .betweenCreatedDates(startDate, endDate)
      .sortBy(sortBy, sortOrder)
      .paginate(page, perPage)
    return invoices
  }

  async getById({ params }: HttpContext) {
    const invoice = await Invoice.findOrFail(params.id)
    return invoice
  }

  async update({ request, params, bouncer }: HttpContext) {
    const body = await request.validateUsing(updateInvoiceValidator)
    const invoice = await Invoice.findOrFail(params.id)
    await bouncer.authorize('ownsEntity', invoice)
    invoice.merge(body)
    await invoice.save()
    return { message: 'Invoice updated successfully' }
  }

  async delete({ params, bouncer }: HttpContext) {
    const invoice = await Invoice.findOrFail(params.id)
    await bouncer.authorize('ownsEntity', invoice)
    await invoice.delete()
    return { message: 'Invoice deleted successfully' }
  }
}
