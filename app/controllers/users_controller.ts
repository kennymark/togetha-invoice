import Activity from '#models/activity'
import Invoice from '#models/invoice'
import Job from '#models/job'
import User from '#models/user'
import EmailService from '#services/email_service'
import env from '#start/env'
import { validateQueryParams } from '#utils/vine'
import {
  createUserValidator,
  loginValidator,
  resetPasswordRequestValidator,
  resetPasswordValidator,
  updateUserValidator,
} from '#validators/user_validator'
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { DateTime } from 'luxon'
import crypto from 'node:crypto'

export default class UsersController {
  async create({ request, response, logger, session }: HttpContext) {
    try {
      const body = await request.validateUsing(createUserValidator)
      const [existingUser, existingPhone] = await Promise.all([
        User.query().where('email', body.email).first(),
        User.query().where('contactNumber', body.contactNumber).first(),
      ])

      if (existingPhone) {
        session.flash('error', { message: 'Phone number already associated with another account' })
        return response.redirect().back()
      }

      if (existingUser) {
        session.flash('error', { message: 'User already exists' })
        return response.redirect().back()
      }

      await User.create(body)
      logger.info('User created', { email: body.email })

      await EmailService.send('signup-success', {
        email: body.email,
        subject: 'Welcome to Togetha Invoice!',
        loginUrl: `${env.get('APP_URL')}/auth/login`,
        user: {
          fullName: body.fullName,
        },
      })
      session.flash('success', { message: 'Account created successfully! Please log in.' })
      return response.redirect().toPath('/auth/login')
    } catch (error) {
      console.error(error)
      if (error.messages) {
        session.flash('errors', error.messages)
        return response.redirect().back()
      }

      session.flash('error', { message: 'An error occurred while creating your account' })
      return response.redirect().back()
    }
  }

  async login({ auth, request, response, session }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)
      const user = await User.verifyCredentials(email, password)

      await auth.use('web').login(user)

      session.flash('success', { message: 'Successfully logged in!' })
      return response.redirect().toPath('/dashboard')
    } catch (error) {
      if (error.messages) {
        session.flash('errors', error.messages)
        return response.redirect().back()
      }

      session.flash('error', { message: 'Invalid email or password' })
      return response.redirect().back()
    }
  }

  async delete({ response, params, session }: HttpContext) {
    try {
      const id = params.id
      const user = await User.query().where({ id }).first()

      if (!user) {
        session.flash('error', { message: 'User not found' })
        return response.redirect().back()
      }

      await user.delete()
      session.flash('success', { message: 'User deleted successfully' })
      return response.redirect().back()
    } catch (error) {
      session.flash('error', { message: 'Failed to delete user' })
      return response.redirect().back()
    }
  }

  async forgotPassword({ request, response, session }: HttpContext) {
    try {
      const { email } = await request.validateUsing(resetPasswordRequestValidator)
      const user = await User.findBy('email', email)

      if (!user) {
        session.flash('error', { message: 'User not found' })
        return response.redirect().back()
      }

      const token = crypto.randomBytes(32).toString('hex')
      user.resetToken = token
      user.resetTokenExpiresAt = DateTime.now().plus({ hours: 1 })
      await user.save()

      const resetUrl = `${env.get('APP_URL')}/reset-password?token=${token}&email=${email}`
      const userData = {
        fullName: user.fullName || '',
      }

      await EmailService.send('forgot-password', {
        email: user.email,
        resetUrl,
        user: userData,
        subject: 'Reset your password',
      })

      session.flash('success', { message: 'Password reset link sent to your email' })
      return response.redirect().back()
    } catch (error) {
      if (error.messages) {
        session.flash('errors', error.messages)
        return response.redirect().back()
      }

      session.flash('error', { message: 'Failed to process password reset request' })
      return response.redirect().back()
    }
  }

  async resetPassword({ request, response, session }: HttpContext) {
    try {
      const { email, token, password } = await request.validateUsing(resetPasswordValidator)
      const user = await User.findBy('email', email)

      if (!user || !user.resetToken || !user.resetTokenExpiresAt) {
        session.flash('error', { message: 'Invalid or expired reset token' })
        return response.redirect().back()
      }

      if (user.resetToken !== token || user.resetTokenExpiresAt < DateTime.now()) {
        session.flash('error', { message: 'Invalid or expired reset token' })
        return response.redirect().back()
      }

      user.password = password
      user.resetToken = null
      user.resetTokenExpiresAt = null
      await user.save()

      const userData = {
        fullName: user.fullName || '',
      }

      await EmailService.send('reset-password', {
        user: userData,
        email: user.email,
        subject: 'Password reset successful',
      })

      session.flash('success', { message: 'Password reset successful. You can now log in.' })
      return response.redirect().toPath('/login')
    } catch (error) {
      if (error.messages) {
        session.flash('errors', error.messages)
        return response.redirect().back()
      }

      session.flash('error', { message: 'Failed to reset password' })
      return response.redirect().back()
    }
  }

  async logout({ auth, response, session }: HttpContext) {
    await auth.use('web').logout()
    session.flash('success', { message: 'Successfully logged out!' })
    return response.redirect().toPath('/auth/login')
  }

  async dashboard({ inertia, auth, request }: HttpContext) {
    const { page = 1, perPage = 10 } = await validateQueryParams(request.qs())

    const [activities, stats] = await Promise.all([
      Activity.query()
        .where('userId', auth.user!.id)
        .orderBy('createdAt', 'desc')
        .preload('customer', (query) => query.select('id', 'fullName'))
        .preload('job', (query) => query.select('id', 'title'))
        .preload('invoice', (query) => query.select('id', 'title', 'amount'))
        .paginate(page, perPage),
      Promise.all([
        Invoice.query().where('userId', auth.user!.id).where('status', 'paid').getSum('amount'),
        Job.query().where('userId', auth.user!.id).where('status', 'pending').getCount(),
        Invoice.query()
          .where('userId', auth.user!.id)
          .whereIn('status', ['pending', 'overdue'])
          .getCount(),
      ]),
    ])

    const [totalEarnings, activeJobs, unpaidInvoices] = stats

    return inertia.render('dashboard/home/index', {
      activities,
      stats: {
        totalEarnings: totalEarnings?.total || 0,
        activeJobs: activeJobs.total || 0,
        unpaidInvoices: unpaidInvoices.total || 0,
      },
    })
  }

  async settings({ inertia, auth }: HttpContext) {
    return inertia.render('dashboard/settings/index', {
      user: auth.user,
    })
  }

  async updateAccountSettings({ request, response, auth, session }: HttpContext) {
    try {
      const body = await request.validateUsing(updateUserValidator)
      const user = await auth.getUserOrFail()
      const emailChanged = user.email !== body.email

      user.merge({
        fullName: body.fullName,
        email: body.email,
        secondaryEmail: body.secondaryEmail,
        contactNumber: body.contactNumber,
      })

      await user.save()

      await Activity.create({
        userId: user.id,
        type: 'updated',
        summary: await Activity.generateSummary('updated', user, 'user'),
      })

      if (emailChanged) {
        await auth.use('web').logout()
        session.flash('info', { message: 'Please log in again with your new email' })
        return response.redirect().toPath('/auth/login')
      }

      session.flash('success', { message: 'Account settings updated successfully' })
      return response.redirect().back()
    } catch (error) {
      console.error('Error updating account settings:', error)
      if (error.messages) {
        session.flash('errors', error.messages)
        return response.redirect().back()
      }

      session.flash('error', { message: 'Failed to update account settings' })
      return response.redirect().back()
    }
  }

  async updatePassword({ request, response, auth, session }: HttpContext) {
    try {
      const { currentPassword, newPassword, confirmPassword } = await request.validateUsing(
        vine.compile(
          vine.object({
            currentPassword: vine.string(),
            newPassword: vine.string().minLength(8),
            confirmPassword: vine.string().minLength(8),
          }),
        ),
      )

      const user = await auth.getUserOrFail()

      const isValidPassword = await User.verifyCredentials(user.email, currentPassword)
      if (!isValidPassword) {
        session.flash('error', { message: 'Current password is incorrect' })
        return response.redirect().back()
      }

      if (newPassword !== confirmPassword) {
        session.flash('error', { message: 'New password and confirmation do not match' })
        return response.redirect().back()
      }

      user.password = newPassword
      await user.save()

      await Activity.create({
        userId: user.id,
        type: 'passwordUpdated',
        summary: await Activity.generateSummary('passwordUpdated', user, 'user'),
      })

      await auth.use('web').logout()
      session.flash('success', { message: 'Password updated successfully. Please log in again.' })
      return response.redirect().toPath('/auth/login')
    } catch (error) {
      console.error('Error updating password:', error)
      if (error.messages) {
        session.flash('errors', error.messages)
        return response.redirect().back()
      }

      session.flash('error', { message: 'Failed to update password' })
      return response.redirect().back()
    }
  }
}
