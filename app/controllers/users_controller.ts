import User from '#models/user'
import {
  createUserValidator,
  loginValidator,
  updateUserValidator,
} from '#validators/user_validator'
import type { HttpContext } from '@adonisjs/core/http'

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
}
