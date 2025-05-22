import Activity from '#models/activity'
import Customer from '#models/customer'
import Invoice from '#models/invoice'
import Service from '#models/service'
import { validateQueryParams } from '#utils/vine'
import { createInvoiceValidator, updateInvoiceValidator } from '#validators/invoice_validator'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class InvoicesController {
  async createInvoice({ auth, request, logger, session, response }: HttpContext) {
    const trx = await db.transaction()
    try {
      const { services, ...body } = await request.validateUsing(createInvoiceValidator)
      const invoice = await Invoice.create(
        {
          ...body,
          userId: auth.user?.id,
          dueDate: new Date(body.dueDate),
          isRecurringStartDate: new Date(body.isRecurringStartDate),
          isRecurringEndDate: new Date(body.isRecurringEndDate),
        },
        { client: trx },
      )

      for (const service of services) {
        await Service.create({ ...service, invoiceId: invoice.id }, { client: trx })
      }

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

      console.log(e)

      if (e.messages) {
        session.flash('errors', e.messages)
        return response.redirect().back()
      }

      session.flash('error', { message: 'Failed to create invoice' })
      return response.redirect().back()
    }
  }

  async getAll({ auth, request, inertia }: HttpContext) {
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
      .preload('customer')
      .paginate(page, perPage)

    const totalInvoices = await Invoice.query().where('user_id', auth.user!.id).getCount()

    const overdueInvoices = await Invoice.query()
      .where('user_id', auth.user!.id)
      .where('due_date', '<', new Date())
      .where('status', '!=', 'paid')
      .getCount()

    return inertia.render('dashboard/invoices/index', {
      invoices,
      stats: {
        totalInvoices: totalInvoices.total,
        overdueInvoices: overdueInvoices.total,
      },
    })
  }

  async getById({ params }: HttpContext) {
    const invoice = await Invoice.findOrFail(params.id)
    return invoice
  }

  async getCustomersCreateInvoice({ auth, inertia }: HttpContext) {
    const customers = await Customer.query()
      .where('user_id', auth.user!.id)
      .select('id', 'fullName', 'email')

    return inertia.render('dashboard/invoices/create/index', { customers })
  }

  async update({ request, params, bouncer, response, session, logger }: HttpContext) {
    const body = await request.validateUsing(updateInvoiceValidator)
    const invoice = await Invoice.findOrFail(params.id)
    try {
      await bouncer.authorize('ownsEntity', invoice)
      invoice.merge({
        ...body,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        isRecurringStartDate: body.isRecurringStartDate
          ? new Date(body.isRecurringStartDate)
          : undefined,
        isRecurringEndDate: body.isRecurringEndDate ? new Date(body.isRecurringEndDate) : undefined,
      })
      await invoice.save()

      session.flash('success', { message: 'Invoice updated successfully' })
      return response.redirect().toPath('/dashboard/invoices')
    } catch (e) {
      logger.error(e)
      session.flash('error', { message: 'Failed to update invoice' })
      return response.redirect().back()
    }
  }
  async delete({ params, bouncer, response, session, logger, auth }: HttpContext) {
    const invoice = await Invoice.findOrFail(params.id)
    try {
      await bouncer.authorize('ownsEntity', invoice)
      await invoice.delete()

      await Activity.create({
        userId: auth.user?.id,
        type: 'deleted',
        invoiceId: invoice.id,
        summary: await Activity.generateSummary('deleted', invoice),
      })

      session.flash('success', { message: 'Invoice deleted successfully' })
      return response.redirect().toPath('/dashboard/invoices')
    } catch (e) {
      logger.error(e)
      session.flash('error', { message: 'Failed to delete invoice' })
      return response.redirect().back()
    }
  }
}
