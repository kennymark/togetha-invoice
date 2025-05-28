import Payment from '#models/payment'
import Invoice from '#models/invoice'
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

  async renderFinancePage({ auth, inertia }: HttpContext) {
    // Calculate payment statistics
    const paymentStats = await db
      .from('payments')
      .select(
        db.raw('SUM(amount) as total_amount'),
        db.raw('SUM(CASE WHEN status = ? THEN amount ELSE 0 END) as pending_amount', ['pending']),
        db.raw('SUM(CASE WHEN status = ? THEN amount ELSE 0 END) as completed_amount', ['paid']),
        db.raw('SUM(CASE WHEN status = ? THEN amount ELSE 0 END) as failed_amount', ['failed']),
      )
      .first()

    // Calculate invoice statistics
    const invoiceStats = await db
      .from('invoices')
      .where('user_id', auth.user!.id)
      .select(
        db.raw('SUM(amount) as total_amount'),
        db.raw('SUM(CASE WHEN status = ? THEN amount ELSE 0 END) as pending_amount', ['pending']),
        db.raw('SUM(CASE WHEN status = ? THEN amount ELSE 0 END) as paid_amount', ['paid']),
        db.raw('SUM(CASE WHEN status = ? THEN amount ELSE 0 END) as overdue_amount', ['overdue']),
      )
      .first()

    // Get payment trends for last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split('T')[0]
    }).reverse()

    const paymentTrends = await Promise.all(
      last7Days.map(async (date) => {
        const result = await db
          .from('payments')
          .where('created_at', '>=', `${date} 00:00:00`)
          .where('created_at', '<=', `${date} 23:59:59`)
          .select(db.raw('SUM(amount) as amount'))
          .first()
        return {
          date,
          amount: Number(result?.amount || 0),
        }
      }),
    )

    const invoiceTrends = await Promise.all(
      last7Days.map(async (date) => {
        const result = await db
          .from('invoices')
          .where('user_id', auth.user!.id)
          .where('created_at', '>=', `${date} 00:00:00`)
          .where('created_at', '<=', `${date} 23:59:59`)
          .select(db.raw('SUM(amount) as amount'))
          .first()
        return {
          date,
          amount: Number(result?.amount || 0),
        }
      }),
    )

    // Get payment status distribution
    const paymentStatusDistribution = await db
      .from('payments')
      .select('status')
      .select(db.raw('COUNT(*) as count'))
      .groupBy('status')

    // Get invoice status distribution
    const invoiceStatusDistribution = await db
      .from('invoices')
      .where('user_id', auth.user!.id)
      .select('status')
      .select(db.raw('COUNT(*) as count'))
      .groupBy('status')

    return inertia.render('dashboard/finance/index', {
      stats: {
        payments: {
          totalAmount: Number(paymentStats?.total_amount || 0),
          pendingAmount: Number(paymentStats?.pending_amount || 0),
          completedAmount: Number(paymentStats?.completed_amount || 0),
          failedAmount: Number(paymentStats?.failed_amount || 0),
        },
        invoices: {
          totalAmount: Number(invoiceStats?.total_amount || 0),
          pendingAmount: Number(invoiceStats?.pending_amount || 0),
          paidAmount: Number(invoiceStats?.paid_amount || 0),
          overdueAmount: Number(invoiceStats?.overdue_amount || 0),
        },
      },
      trends: {
        payments: paymentTrends,
        invoices: invoiceTrends,
      },
      statusDistribution: {
        payments: paymentStatusDistribution.map((item) => ({
          status: item.status,
          value: Number(item.count),
        })),
        invoices: invoiceStatusDistribution.map((item) => ({
          status: item.status,
          value: Number(item.count),
        })),
      },
    })
  }
}
