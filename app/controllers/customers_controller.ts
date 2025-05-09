import Customer from '#models/customer'
import { validateQueryParams } from '#utils/vine'
import { createCustomerValidator, updateCustomerValidator } from '#validators/customer_validator'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class CustomersController {
  async createCustomer({ auth, request, response, logger }: HttpContext) {
    const trx = await db.transaction()
    try {
      const body = await request.validateUsing(createCustomerValidator)
      const findCustomer = await Customer.query().where({ email: body.email }).first()
      if (findCustomer) return response.conflict({ error: 'Customer already exists' })
      await Customer.create({ ...body, userId: auth.user?.id }, { client: trx })
      await trx.commit()
      logger.info(`Customer created: ${body.fullName}`)
      return { message: 'Customer created successfully' }
    } catch (e) {
      await trx.rollback()
      logger.error(e)
      throw e
    }
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
    const customers = await Customer.query()
      .betweenCreatedDates(startDate, endDate)
      .sortBy(sortBy, sortOrder)
      .paginate(page, perPage)
    return customers
  }

  async dashboard() {
    const totalCustomers = await Customer.query().getCount()
    return { totalCustomers }
  }

  async update({ request, params }: HttpContext) {
    const body = await request.validateUsing(updateCustomerValidator)
    const customer = await Customer.findOrFail(params.id)
    customer.merge(body)
    await customer.save()
    return { message: 'Customer updated successfully' }
  }

  async delete({ params }: HttpContext) {
    const customer = await Customer.findOrFail(params.id)
    await customer.delete()
    return { message: 'Customer deleted successfully' }
  }
}
