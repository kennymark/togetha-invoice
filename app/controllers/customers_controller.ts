import Customer from '#models/customer'
import { validateQueryParams } from '#utils/vine'
import { createCustomerValidator, updateCustomerValidator } from '#validators/customer_validator'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class CustomersController {
  async createCustomer({ auth, request, response, logger, session }: HttpContext) {
    const trx = await db.transaction()
    try {
      const body = await request.validateUsing(createCustomerValidator)
      const findCustomer = await Customer.query().where({ email: body.email }).first()

      if (findCustomer) {
        session.flash('error', { message: 'Customer already exists' })
        return response.redirect().back()
      }

      await Customer.create({ ...body, userId: auth.user?.id }, { client: trx })
      await trx.commit()
      logger.info(`Customer created: ${body.fullName}`)

      session.flash('success', { message: 'Customer created successfully' })
      return response.redirect().toPath('/dashboard/customers')
    } catch (e) {
      await trx.rollback()
      logger.error(e)

      if (e.messages) {
        session.flash('errors', e.messages)
        return response.redirect().back()
      }

      session.flash('error', { message: 'Failed to create customer' })
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

    const customers = await Customer.query()
      .where('user_id', auth.user!.id)
      .betweenCreatedDates(startDate, endDate)
      .sortBy(sortBy, sortOrder)
      .paginate(page, perPage)

    const totalCustomers = await Customer.query().where('user_id', auth.user!.id).getCount()

    return inertia.render('dashboard/customers/index', {
      customers: customers,
      stats: totalCustomers.total,
    })
  }

  async getCustomer({ params, bouncer, inertia }: HttpContext) {
    const customer = await Customer.findOrFail(params.customerId)
    await bouncer.authorize('ownsEntity', customer)
    return inertia.render('dashboard/customers/edit/index', { customer })
  }

  async update({ request, params, bouncer, response, session, logger }: HttpContext) {
    try {
      const body = await request.validateUsing(updateCustomerValidator)
      const customer = await Customer.findOrFail(params.customerId)
      await bouncer.authorize('ownsEntity', customer)

      customer.merge(body)
      await customer.save()

      session.flash('success', { message: 'Customer updated successfully' })
      return response.redirect().toPath('/dashboard/customers')
    } catch (e) {
      logger.error(e)

      if (e.messages) {
        session.flash('errors', e.messages)
        return response.redirect().back()
      }

      session.flash('error', { message: 'Failed to update customer' })
      return response.redirect().back()
    }
  }

  async customerDetails({ params, bouncer, inertia, auth }: HttpContext) {
    const customer = await Customer.query()
      .where('id', params.customerId)
      .where('user_id', auth.user!.id)
      .firstOrFail()
    await bouncer.authorize('ownsEntity', customer)

    return inertia.render('dashboard/customers/details', { customer })
  }

  async delete({ params, bouncer, response }: HttpContext) {
    const customer = await Customer.findOrFail(params.id)
    await bouncer.authorize('ownsEntity', customer)
    await customer.delete()
    return response.json({ message: 'Customer deleted successfully' })
  }
}
