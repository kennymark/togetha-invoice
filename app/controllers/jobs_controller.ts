import Job from '#models/job'
import { validateQueryParams } from '#utils/vine'
import { createJobValidator, updateJobValidator } from '#validators/job_validator'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class JobsController {
  async createJob({ request, logger }: HttpContext) {
    const trx = await db.transaction()
    try {
      const body = await request.validateUsing(createJobValidator)
      await Job.create(body, { client: trx })
      await trx.commit()
      logger.info(`Job created: ${body.title}`)
      return { message: 'Job created successfully' }
    } catch (e) {
      await trx.rollback()
      logger.error(e)
      throw e
    }
  }

  async dashboard() {}

  async getAll({ request }: HttpContext) {
    const {
      page = 1,
      perPage = 10,
      startDate,
      endDate,
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = await validateQueryParams(request.qs())
    const jobs = await Job.query()
      .betweenCreatedDates(startDate, endDate)
      .sortBy(sortBy, sortOrder)
      .paginate(page, perPage)
    return jobs
  }

  async update({ request, params }: HttpContext) {
    const body = await request.validateUsing(updateJobValidator)
    const job = await Job.findOrFail(params.id)
    job.merge(body)
    await job.save()
    return { message: 'Job updated successfully' }
  }

  async delete({ params }: HttpContext) {
    const job = await Job.findOrFail(params.id)
    await job.delete()
    return { message: 'Job deleted successfully' }
  }
}
