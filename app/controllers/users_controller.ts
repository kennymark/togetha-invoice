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
  async create({ request, response, logger }: HttpContext) {
    const body = await request.validateUsing(createUserValidator)
    const findUser = await User.query().where('email', body.email).first()
    if (findUser) return response.conflict({ error: 'User already exists' })
    await User.create(body)
    logger.info('User created', { email: body.email })
    return { message: 'User created successfully' }
  }

  async apiLogin({ request }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)
    return { user, token }
  }

  async update({ auth, request }: HttpContext) {
    const body = await request.validateUsing(updateUserValidator)
    auth.user?.merge(body)
    await auth.user?.save()
    return { message: 'user profile updated successfully' }
  }

  async me({ auth, response }: HttpContext) {
    return response.ok({ message: 'logged in', user: auth.user })
  }

  async delete({ response, params }: HttpContext) {
    // TODO: check for permissions
    const id = params.id
    const user = await User.query().where({ id }).first()
    await user?.delete()
    return response.ok({ message: 'User deleted successfully' })
  }

  async forgotPassword({ request, response }: HttpContext) {
    const { email } = await request.validateUsing(resetPasswordRequestValidator)
    const user = await User.findBy('email', email)

    if (!user) {
      return response.redirect().withQs({ error: 'User not found' }).back()
    }
    //Generate token and expiry
    const token = crypto.randomBytes(32).toString('hex')
    user.resetToken = token
    user.resetTokenExpiresAt = DateTime.now().plus({ hours: 1 })
    await user.save()
    //Send reset request email
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
    return response.redirect().withQs({ success: 'Password reset link sent to your email.' }).back()
  }

  async resetPassword({ request, response }: HttpContext) {
    const { email, token, password } = await request.validateUsing(resetPasswordValidator)
    const user = await User.findBy('email', email)
    if (!user || !user.resetToken || !user.resetTokenExpiresAt) {
      return response.redirect().withQs({ error: 'Invalid or expired token.' }).back()
    }
    if (user.resetToken !== token || user.resetTokenExpiresAt < DateTime.now()) {
      return response.redirect().withQs({ error: 'Invalid or expired token.' }).back()
    }
    user.password = password
    user.resetToken = null
    user.resetTokenExpiresAt = null
    await user.save()
    // Send reset success email
    const userData = {
      fullName: user.fullName || '',
    }
    await EmailService.send('reset-password', {
      user: userData,
      email: user.email,
      subject: 'Password reset successful',
    })
    return response
      .redirect()
      .withQs({ success: 'Password reset successful. You can now log in.' })
      .toPath('/login')
  }
}
