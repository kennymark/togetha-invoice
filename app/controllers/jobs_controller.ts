import Customer from '#models/customer'
import Job from '#models/job'
import { validateQueryParams } from '#utils/vine'
import { createJobValidator, updateJobValidator } from '#validators/job_validator'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class JobsController {
  async createJob({ auth, request, response, logger, session }: HttpContext) {
    const trx = await db.transaction()
    try {
      const body = await request.validateUsing(createJobValidator)
      await Job.create({ ...body, userId: auth.user?.id }, { client: trx })
      await trx.commit()
      logger.info(`Job created: ${body.title}`)

      session.flash('success', { message: 'Job created successfully' })
      return response.redirect().toPath('/dashboard/jobs')
    } catch (e) {
      await trx.rollback()
      logger.error(e)

      if (e.messages) {
        session.flash('errors', e.messages)
        return response.redirect().back()
      }

      session.flash('error', { message: 'Failed to create job' })
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

    const jobs = await Job.query()
      .where('user_id', auth.user!.id)
      .preload('customer')
      .betweenCreatedDates(startDate, endDate)
      .sortBy(sortBy, sortOrder)
      .paginate(page, perPage)

    const [pendingJobs, completedJobs] = await Promise.all([
      Job.query().where('user_id', auth.user!.id).where('status', 'pending').getCount(),
      Job.query().where('user_id', auth.user!.id).where('status', 'completed').getCount(),
    ])

    return inertia.render('dashboard/jobs/index', {
      jobs,
      stats: {
        pendingJobs: pendingJobs.total,
        completedJobs: completedJobs.total,
      },
    })
  }

  async getCustomersCreateJob({ auth, inertia }: HttpContext) {
    const customers = await Customer.query()
      .where('user_id', auth.user!.id)
      .select('id', 'fullName')

    return inertia.render('dashboard/jobs/create/index', { customers })
  }

  async editJob({ params, bouncer, inertia, auth }: HttpContext) {
    const job = await Job.findOrFail(params.jobId)
    const customers = await Customer.query()
      .where('user_id', auth.user!.id)
      .select('id', 'fullName')

    await bouncer.authorize('ownsEntity', job)
    return inertia.render('dashboard/jobs/edit/index', { job, customers })
  }

  async update({ request, params, bouncer, response, session, logger }: HttpContext) {
    try {
      const body = await request.validateUsing(updateJobValidator)
      const job = await Job.findOrFail(params.id)
      await bouncer.authorize('ownsEntity', job)

      job.merge(body)
      await job.save()

      session.flash('success', { message: 'Job updated successfully' })
      return response.redirect().toPath('/dashboard/jobs')
    } catch (e) {
      logger.error(e)

      if (e.messages) {
        session.flash('errors', e.messages)
        return response.redirect().back()
      }

      session.flash('error', { message: 'Failed to update job' })
      return response.redirect().back()
    }
  }

  async delete({ params, bouncer }: HttpContext) {
    const job = await Job.findOrFail(params.id)
    await bouncer.authorize('ownsEntity', job)
    await job.delete()
    return { message: 'Job deleted successfully' }
  }

  async jobDetails({ params, bouncer, inertia, auth }: HttpContext) {
    const job = await Job.query()
      .where('id', params.jobId)
      .where('user_id', auth.user!.id)
      .preload('customer', (query) => query.select('id', 'fullName', 'email', 'address'))
      .firstOrFail()
    await bouncer.authorize('ownsEntity', job)

    return inertia.render('dashboard/jobs/details', { job })
  }
}
