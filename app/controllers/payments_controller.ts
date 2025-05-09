import Payment from '#models/payment'
import { validateQueryParams } from '#utils/vine'
import { createPaymentValidator, updatePaymentValidator } from '#validators/payment_validator'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class PaymentsController {
  async createPayment({ request, logger }: HttpContext) {
    const trx = await db.transaction()
    try {
      const body = await request.validateUsing(createPaymentValidator)
      await Payment.create(body, { client: trx })
      await trx.commit()
      logger.info(`Payment created: ${body.title}`)
      return { message: 'Payment created successfully' }
    } catch (e) {
      await trx.rollback()
      logger.error(e)
      throw e
    }
  }

  async getAll({ auth, request }: HttpContext) {
    const {
      page = 1,
      perPage = 10,
      startDate,
      endDate,
      sortBy = 'created_at',
      sortOrder = 'desc',
      paymentStatus,
    } = await validateQueryParams(request.qs())
    const payments = await Payment.query()
      .where('user_id', auth.user!.id)
      .where('status', paymentStatus)
      .betweenCreatedDates(startDate, endDate)
      .sortBy(sortBy, sortOrder)
      .paginate(page, perPage)
    return payments
  }

  async getById({ params }: HttpContext) {
    const payment = await Payment.findOrFail(params.id)
    return payment
  }

  async updatePayment({ params, request, bouncer }: HttpContext) {
    const body = await request.validateUsing(updatePaymentValidator)
    const payment = await Payment.findOrFail(params.id)
    await bouncer.authorize('ownsEntity', payment)
    payment.merge(body)
    await payment.save()
    return payment
  }

  async delete({ params, bouncer }: HttpContext) {
    const payment = await Payment.findOrFail(params.id)
    await bouncer.authorize('ownsEntity', payment)
    await payment.delete()
    return { message: 'Payment deleted successfully' }
  }
}
