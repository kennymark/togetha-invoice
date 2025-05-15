import User from '#models/user'
import EmailService from '#services/email_service'
import env from '#start/env'
import {
  createUserValidator,
  loginValidator,
  resetPasswordRequestValidator,
  resetPasswordValidator,
  updateUserValidator,
} from '#validators/user_validator'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import crypto from 'node:crypto'

export default class UsersController {
  async create({ request, response, logger, session }: HttpContext) {
    try {
      const body = await request.validateUsing(createUserValidator)
      const findUser = await User.query().where('email', body.email).first()

      if (findUser) {
        session.flash('error', { message: 'User already exists' })
        return response.redirect().back()
      }

      await User.create(body)
      logger.info('User created', { email: body.email })

      session.flash('success', { message: 'Account created successfully! Please log in.' })
      return response.redirect().toPath('/auth/login')
    } catch (error) {
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

  async update({ auth, request, response, session }: HttpContext) {
    try {
      const body = await request.validateUsing(updateUserValidator)
      auth.user?.merge(body)
      await auth.user?.save()

      session.flash('success', { message: 'Profile updated successfully' })
      return response.redirect().back()
    } catch (error) {
      if (error.messages) {
        session.flash('errors', error.messages)
        return response.redirect().back()
      }

      session.flash('error', { message: 'Failed to update profile' })
      return response.redirect().back()
    }
  }

  async me({ auth, response }: HttpContext) {
    return response.redirect().toPath('/dashboard')
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
    return response.redirect().toPath('/')
  }
}
