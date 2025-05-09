import Job from '#models/job'
import { validateQueryParams } from '#utils/vine'
import { createJobValidator, updateJobValidator } from '#validators/job_validator'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class JobsController {
  async createJob({ auth, request, logger }: HttpContext) {
    const trx = await db.transaction()
    try {
      const body = await request.validateUsing(createJobValidator)
      await Job.create({ ...body, userId: auth.user?.id }, { client: trx })
      await trx.commit()
      logger.info(`Job created: ${body.title}`)
      return { message: 'Job created successfully' }
    } catch (e) {
      await trx.rollback()
      logger.error(e)
      throw e
    }
  }

  async dashboard() {
    const [completedJobs, pendingJobs] = await Promise.all([
      Job.query().where('status', 'completed').getCount(),
      Job.query().where('status', 'pending').getCount(),
    ])
    return { pendingJobs: pendingJobs.total, completedJobs: completedJobs.total }
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
    const jobs = await Job.query()
      .where('user_id', auth.user!.id)
      .betweenCreatedDates(startDate, endDate)
      .sortBy(sortBy, sortOrder)
      .paginate(page, perPage)
    return jobs
  }

  async update({ request, params, bouncer }: HttpContext) {
    const body = await request.validateUsing(updateJobValidator)
    const job = await Job.findOrFail(params.id)
    await bouncer.authorize('ownsEntity', job)
    job.merge(body)
    await job.save()
    return { message: 'Job updated successfully' }
  }

  async delete({ params, bouncer }: HttpContext) {
    const job = await Job.findOrFail(params.id)
    await bouncer.authorize('ownsEntity', job)
    await job.delete()
    return { message: 'Job deleted successfully' }
  }
}
