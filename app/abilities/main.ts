/*
|--------------------------------------------------------------------------
| Bouncer abilities
|--------------------------------------------------------------------------
|
| You may export multiple abilities from this file and pre-register them
| when creating the Bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

/**
 * Delete the following ability to start from
 * scratch
 */
import type User from '#models/user'
import { Bouncer } from '@adonisjs/bouncer'

export const canMakeChanges = Bouncer.ability((user: User, entity: any) => {
  if (user.id === entity.userId) {
    return true
  }
  return false
})

export const ownsEntity = Bouncer.ability((user: User, entity: any) => {
  if (entity.userId === user.id) {
    return true
  }
  return false
})
