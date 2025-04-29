import vine from '@vinejs/vine'

const email = vine.string().toLowerCase().trim().email()

export const createCustomerValidator = vine.compile(
  vine.object({
    fullName: vine.string().maxLength(255),
    email,
    phone: vine.string(),
    address: vine.string(),
    postCode: vine.string(),
    state: vine.string(),
    city: vine.string(),
    country: vine.string(),
    businessName: vine.string().optional(),
    businessAddress: vine.string().optional(),
  }),
)

export const updateCustomerValidator = vine.compile(
  vine.object({
    fullName: vine.string().maxLength(255),
    email: email.optional(),
    phone: vine.string().optional(),
    address: vine.string().optional(),
    postCode: vine.string().optional(),
    state: vine.string().optional(),
    city: vine.string().optional(),
    country: vine.string().optional(),
    businessName: vine.string().optional(),
    businessAddress: vine.string().optional(),
  }),
)
