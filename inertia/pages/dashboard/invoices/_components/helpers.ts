import { router } from '@inertiajs/react'
import type { UseFormReturn } from 'react-hook-form'
import type { InvoiceFormValues } from '~/lib/schemas/invoice'

// Helper functions for service calculations
export const calculateServiceTotal = (quantity: number, unitPrice: number): number => {
  return Number((quantity * unitPrice).toFixed(2))
}

export const calculateInvoiceSubtotal = (
  services: InvoiceFormValues['services'] | undefined,
): number => {
  if (!services?.length) return 0

  const total = services.reduce((acc: number, curr: InvoiceFormValues['services'][0]) => {
    const price = Number(curr.totalPrice) || 0
    return acc + price
  }, 0)

  return Number(total.toFixed(2))
}

export const calculateInvoiceTotal = (
  subtotal: number,
  discount: number | undefined,
  discountType: 'amount' | 'percentage' | undefined,
  form: UseFormReturn<InvoiceFormValues>,
): number => {
  const safeDiscount = discount ?? 0
  const safeDiscountType = discountType ?? 'amount'

  if (safeDiscountType === 'percentage') {
    const discountAmount = subtotal * (safeDiscount / 100)
    form.setValue('amount', subtotal - discountAmount)
    return Number((subtotal - discountAmount).toFixed(2))
  }
  form.setValue('amount', subtotal - safeDiscount)
  return Number((subtotal - safeDiscount).toFixed(2))
}

export const handleServiceQuantityChange = (
  form: UseFormReturn<InvoiceFormValues>,
  index: number,
  value: number,
) => {
  const quantity = value || 0
  const unitPrice = form.watch(`services.${index}.unitPrice`) || 0
  const totalPrice = calculateServiceTotal(quantity, unitPrice)

  form.setValue(`services.${index}.quantity`, quantity, { shouldValidate: false })
  form.setValue(`services.${index}.totalPrice`, totalPrice, { shouldValidate: false })
}

export const handleServiceUnitPriceChange = (
  form: UseFormReturn<InvoiceFormValues>,
  index: number,
  value: number,
) => {
  const unitPrice = value || 0
  const quantity = form.watch(`services.${index}.quantity`) || 0
  const totalPrice = calculateServiceTotal(quantity, unitPrice)

  form.setValue(`services.${index}.unitPrice`, unitPrice, { shouldValidate: false })
  form.setValue(`services.${index}.totalPrice`, totalPrice, { shouldValidate: false })
}

export const handleAddService = (form: UseFormReturn<InvoiceFormValues>) => {
  const services = form.getValues('services') || []
  form.setValue(
    'services',
    [...services, { name: '', description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
    { shouldValidate: false },
  )
}

export const handleRemoveService = (form: UseFormReturn<InvoiceFormValues>, index: number) => {
  const services = form.getValues('services')
  if (services.length > 1) {
    const newServices = services.filter((_: unknown, i: number) => i !== index)
    form.setValue('services', newServices, { shouldValidate: false })
  }
}

export const handleSubmit = (data: InvoiceFormValues) => {
  const processedData = {
    ...data,
    services: data.services.map((service: InvoiceFormValues['services'][0]) => ({
      ...service,
      quantity: Number(service.quantity),
      unitPrice: Number(service.unitPrice),
      totalPrice: Number(service.totalPrice),
    })),
  }
  router.post('/invoices', processedData)
}
