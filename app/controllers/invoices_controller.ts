import Activity from '#models/activity'
import Customer from '#models/customer'
import Invoice from '#models/invoice'
import Service from '#models/service'
import { validateQueryParams } from '#utils/vine'
import { createInvoiceValidator, updateInvoiceValidator } from '#validators/invoice_validator'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class InvoicesController {
  async renderInvoicesPage({ auth, request, inertia }: HttpContext) {
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

  async renderCreateInvoicePage({ auth, inertia }: HttpContext) {
    const customers = await Customer.query()
      .where('user_id', auth.user!.id)
      .select('id', 'fullName', 'email')

    return inertia.render('dashboard/invoices/create/index', { customers })
  }

  async renderEditInvoicePage({ auth, inertia, params }: HttpContext) {
    const invoice = await Invoice.query()
      .where('user_id', auth.user!.id)
      .where('id', params.invoiceId)
      .preload('services')
      .firstOrFail()
    const customers = await Customer.query()
      .where('user_id', auth.user!.id)
      .select('id', 'fullName', 'email')
    return inertia.render('dashboard/invoices/edit/index', { invoice, customers })
  }

  async create({ auth, request, logger, session, response }: HttpContext) {
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

  async update({ request, params, bouncer, response, session, logger, auth }: HttpContext) {
    const trx = await db.transaction()

    try {
      const { services, ...body } = await request.validateUsing(updateInvoiceValidator)
      const invoice = await Invoice.findOrFail(params.id)
      await bouncer.authorize('ownsEntity', invoice)
      logger.info(`Updating invoice ${invoice.id}`)
      invoice.merge({
        ...body,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        isRecurringStartDate: body.isRecurringStartDate
          ? new Date(body.isRecurringStartDate)
          : undefined,
        isRecurringEndDate: body.isRecurringEndDate ? new Date(body.isRecurringEndDate) : undefined,
      })
      await invoice.save()

      for (const service of services) {
        const existingService = await Service.find(service.id)
        if (existingService) {
          logger.info(`Updating service ${service.id}`)
          await existingService.merge(service).save()
        }
      }

      await trx.commit()
      logger.info(`Invoice updated: ${invoice.id}`)

      await Activity.create({
        userId: auth.user?.id,
        type: 'updated',
        invoiceId: invoice.id,
        summary: await Activity.generateSummary('updated', invoice),
      })

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
  async markAsPaidOrUnpaid({ params, response, session, logger, auth }: HttpContext) {
    const invoice = await Invoice.findOrFail(params.id)
    logger.info(
      `Marking invoice ${invoice.id} as ${invoice.status === 'paid' ? 'overdue' : 'paid'}`,
    )
    invoice.status = invoice.status === 'paid' ? 'overdue' : 'paid'
    await invoice.save()
    await Activity.create({
      userId: auth.user?.id,
      type: 'updated',
      invoiceId: invoice.id,
      summary: `Marked invoice ${invoice.invoiceNumber} as ${invoice.status === 'paid' ? 'overdue' : 'paid'}`,
    })
    session.flash('success', { message: 'Invoice marked as paid' })
    return response.redirect().toPath('/dashboard/invoices')
  }
}
