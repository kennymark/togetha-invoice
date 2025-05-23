import redis from '@adonisjs/redis/services/main'
import type { DateTime } from 'luxon'

type Any = any
export default class CacheService {
  public static fiveMinutes = 300
  public static oneDay = 86_400
  public static stdTTL = CacheService.oneDay

  public static async set(key: string, value: Any, ttl: number | null = null): Promise<void> {
    const parsedValue = typeof value === 'string' ? value : JSON.stringify(value)
    if (ttl) {
      await redis.set(key, parsedValue, 'EX', ttl)
    } else {
      await redis.set(key, parsedValue)
    }
  }

  public static async setExpiry(key: string, expireAt: DateTime): Promise<void> {
    return CacheService.set(`EXPIRE_${key}`, expireAt.toISO())
  }

  public static async destroy(key: string | string[]): Promise<void> {
    Array.isArray(key) ? redis.del(...key) : redis.del(key)
  }

  public static async destroyAll() {
    await redis.flushdb()
  }

  public static async destroyExpiry(key: string) {
    await redis.del(`EXPIRE_${key}`)
  }

  public static async get(key: string, defaultValue: Any = null): Promise<Any> {
    const value = await redis.get(key)
    if (value === null) {
      return defaultValue
    }
    try {
      return JSON.parse(value)
    } catch (err) {
      return value
    }
  }

  public static async has(key: string): Promise<boolean> {
    return (await redis.exists(key)) === 1
  }

  public static async getAll(pattern = ''): Promise<string[]> {
    return redis.keys(pattern)
  }
}
