import Activity from '#models/activity'
import Invoice from '#models/invoice'
import Job from '#models/job'
import { validateQueryParams } from '#utils/vine'
import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  async getActivity({ request }: HttpContext) {
    const { page = 1, perPage = 10, startDate, endDate } = await validateQueryParams(request.qs())
    const activity = await Activity.query()
      .betweenCreatedDates(startDate, endDate)
      .orderBy('created_at', 'desc')
      .paginate(page, perPage)
    return activity
  }

  async getStats() {
    const totalEarnings = await Invoice.query().where('status', 'paid').getSum('amount')
    const activeJobs = await Job.query().where('status', 'pending').getCount()
    const unpaidInvoices = await Invoice.query()
      .where('status', 'pending')
      .orWhere('status', 'overdue')
      .getCount()

    return { totalEarnings, activeJobs, unpaidInvoices }
  }
}
