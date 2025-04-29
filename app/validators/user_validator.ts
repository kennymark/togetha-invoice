import vine from '@vinejs/vine'

const email = vine.string().toLowerCase().trim().email()

export const createUserValidator = vine.compile(
  vine.object({
    fullName: vine.string(),
    email,
    secondaryEmail: vine.string().email().optional(),
    password: vine.string(),
    contactNumber: vine.string(),
  }),
)

export const updateUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().optional(),
    email: email.optional(),
    secondaryEmail: email.optional(),
    contactNumber: vine.string().optional(),
  }),
)

export const loginValidator = vine.compile(
  vine.object({
    email,
    password: vine.string(),
    remember: vine.boolean().optional(),
    referrer: vine.string().optional(),
  }),
)
