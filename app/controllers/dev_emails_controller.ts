import CacheService from '#services/cache_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class DevEmailsController {
  public async index({ response }: HttpContext) {
    try {
      const emails = await CacheService.get('emails', [])

      console.log('emails from controller', emails)
      return response.json(emails)
    } catch (error) {
      return response.status(500).json({ error: 'Failed to fetch dev emails' })
    }
  }
}
