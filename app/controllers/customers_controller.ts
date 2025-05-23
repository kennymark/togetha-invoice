import Activity from '#models/activity'
import Customer from '#models/customer'
import { validateQueryParams } from '#utils/vine'
import { createCustomerValidator, updateCustomerValidator } from '#validators/customer_validator'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class CustomersController {
  async renderCustomersPage({ auth, request, inertia }: HttpContext) {
    const {
      page = 1,
      perPage = 10,
      startDate,
      endDate,
      sortBy = 'created_at',
      sortOrder = 'desc',
      search,
    } = await validateQueryParams(request.qs())

    const customers = await Customer.query()
      .where('user_id', auth.user!.id)
      .betweenCreatedDates(startDate, endDate)
      .sortBy(sortBy, sortOrder)
      .search(search, 'customers')
      .paginate(page, perPage)

    const totalCustomers = await Customer.query().where('user_id', auth.user!.id).getCount()

    return inertia.render('dashboard/customers/index', {
      customers: customers,
      stats: totalCustomers.total,
    })
  }

  async renderEditCustomerPage({ params, bouncer, inertia }: HttpContext) {
    const customer = await Customer.findOrFail(params.customerId)
    await bouncer.authorize('ownsEntity', customer)
    return inertia.render('dashboard/customers/edit/index', { customer })
  }

  async renderCustomerDetailsPage({ params, bouncer, inertia, auth }: HttpContext) {
    const customer = await Customer.query()
      .where('id', params.customerId)
      .where('user_id', auth.user!.id)
      .firstOrFail()
    await bouncer.authorize('ownsEntity', customer)

    return inertia.render('dashboard/customers/details', { customer })
  }

  async create({ auth, request, response, logger, session }: HttpContext) {
    const trx = await db.transaction()
    try {
      const body = await request.validateUsing(createCustomerValidator)
      const findCustomer = await Customer.query().where({ email: body.email }).first()

      if (findCustomer) {
        session.flash('error', { message: 'Customer already exists' })
        return response.redirect().back()
      }

      const customer = await Customer.create({ ...body, userId: auth.user?.id }, { client: trx })

      await Activity.create(
        {
          userId: auth.user?.id,
          type: 'created',
          customerId: customer.id,
          summary: await Activity.generateSummary('created', customer, 'customer'),
        },
        { client: trx },
      )

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

  async update({ request, params, bouncer, response, session, logger, auth }: HttpContext) {
    const trx = await db.transaction()
    try {
      const body = await request.validateUsing(updateCustomerValidator)
      const customer = await Customer.findOrFail(params.customerId)
      await bouncer.authorize('ownsEntity', customer)

      customer.merge(body)

      await customer.save()

      await Activity.create(
        {
          userId: auth.user?.id,
          type: 'updated',
          customerId: customer.id,
          summary: await Activity.generateSummary('updated', customer, 'customer'),
        },
        { client: trx },
      )

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

  async delete({ params, bouncer, response, session, logger, auth }: HttpContext) {
    const customer = await Customer.findOrFail(params.id)
    try {
      await bouncer.authorize('ownsEntity', customer)
      await customer.delete()

      await Activity.create({
        userId: auth.user?.id,
        type: 'deleted',
        customerId: customer.id,
        summary: await Activity.generateSummary('deleted', customer, 'customer'),
      })
      session.flash('success', { message: 'Customer deleted successfully' })
      return response.redirect().toPath('/dashboard/customers')
    } catch (e) {
      logger.error(e)
      session.flash('error', { message: 'Failed to delete customer' })
      return response.redirect().back()
    }
  }
}
