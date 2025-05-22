import { faker } from '@faker-js/faker'
import { Button } from '~/components/ui'
import { showDevFeatures } from '~/lib/utils'
import type { CustomerFormValues } from '~/lib/schemas/customer'
import type { UseFormReset } from 'react-hook-form'
import type { JobFormValues } from '~/lib/schemas/jobs'
import type { InvoiceFormValues } from '~/lib/schemas/invoice'

/**
 * Generates a phone number in E.164 format for supported countries
 * @returns A phone number string in E.164 format (e.g. +14155552671)
 */
const generatePhoneNumber = () => {
  // Using two letter country codes as required by react-phone-number-input
  const country = faker.helpers.arrayElement(['US', 'GB', 'NG']) as 'US' | 'GB' | 'NG'
  const numberFormats = {
    US: () => `+1${faker.number.int({ min: 2000000000, max: 9999999999 })}`,
    GB: () => `+44${faker.number.int({ min: 7000000000, max: 7999999999 })}`,
    NG: () => `+234${faker.number.int({ min: 7000000000, max: 9999999999 })}`,
  }
  return numberFormats[country]()
}

// All fake data generation functions
const fakeDataGenerators = {
  customer: (): CustomerFormValues => ({
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
    phone: generatePhoneNumber(),
    businessName: faker.company.name(),
    address: faker.location.streetAddress(),
    state: faker.location.state(),
    postCode: faker.location.zipCode(),
    city: faker.location.city(),
    country: faker.helpers.arrayElement(['uk', 'ng', 'us']),
    businessAddress: faker.location.streetAddress(),
  }),
  job: (): JobFormValues => ({
    title: faker.helpers.arrayElement([
      'Office Deep Cleaning',
      'Window Washing Service',
      'Carpet Cleaning',
      'Kitchen Deep Cleaning',
      'Bathroom Sanitization',
      'Floor Polishing',
      'Event Venue Cleaning',
      'Post-Construction Cleanup',
      'Move-in/Move-out Cleaning',
      'Commercial Kitchen Cleaning',
      'Facility Maintenance',
      'HVAC Duct Cleaning',
      'Pressure Washing',
      'Graffiti Removal',
      'Emergency Cleanup',
    ]),
    description: faker.lorem.paragraph(),
    category: faker.lorem.word(),
    customerId: '',
    priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
    status: faker.helpers.arrayElement(['pending', 'completed', 'cancelled']),
    dueDate: faker.date.future().toISOString(),
  }),
  invoice: (): InvoiceFormValues => ({
    invoiceNumber: `INV-${faker.number.int({ min: 1000, max: 9999 })}`,
    customerId: '',
    title: faker.helpers.arrayElement([
      'Professional Services Invoice',
      'Consulting Services',
      'Project Development',
      'Maintenance Services',
      'Technical Support',
      'Software Development',
      'Design Services',
      'Marketing Services',
      'Training Services',
      'Equipment Rental',
    ]),
    currency: faker.helpers.arrayElement(['gbp', 'usd', 'eur']),
    dueDate: faker.date.future().toISOString(),
    isRecurringInvoice: faker.datatype.boolean(),
    amount: faker.number.int({ min: 100, max: 1000 }),
    isRecurringStartDate: faker.date.future().toISOString(),
    isRecurringEndDate: faker.date.future({ years: 1 }).toISOString(),
    isRecurringFrequency: faker.helpers.arrayElement(['daily', 'weekly', 'monthly', 'yearly']),
    isDiscounted: faker.datatype.boolean(),
    isDiscountedType: faker.helpers.arrayElement(['amount', 'percentage']),
    isDiscountedValue: faker.number.int({ min: 5, max: 50 }),
    services: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
      name: faker.helpers.arrayElement([
        'Web Development',
        'UI/UX Design',
        'Content Writing',
        'SEO Optimization',
        'Social Media Management',
        'Email Marketing',
        'Video Production',
        'Photography',
        'Consulting',
        'Training',
        'Maintenance',
        'Technical Support',
        'Cloud Services',
        'Data Analysis',
        'Project Management',
      ]),
      description: faker.lorem.sentence(),
      quantity: faker.number.int({ min: 1, max: 10 }),
      unitPrice: faker.number.float({ min: 50, max: 1000, fractionDigits: 2 }),
      totalPrice: 0, // This will be calculated by the form
    })),
    notes: faker.lorem.paragraph(),
  }),

  // Add more generators here as needed, for example:
  // job: () => ({ ... }),
  // etc.
}

type FakeDataType = keyof typeof fakeDataGenerators

interface FakeDataGeneratorProps<T extends FakeDataType> {
  /**
   * The type of fake data to generate
   */
  type: T
  /**
   * The form reset function from react-hook-form
   */
  onGenerate: UseFormReset<ReturnType<(typeof fakeDataGenerators)[T]>>
  /**
   * Optional class name for the button
   */
  className?: string
  /**
   * Optional button variant
   */
  variant?: 'default' | 'outline' | 'ghost'
  /**
   * Optional callback to trigger after generating data
   */
  onAfterGenerate?: () => void
}

/**
 * A development-only component that generates fake data for forms
 * Only renders in development mode
 */
export function FakeDataGenerator<T extends FakeDataType>({
  type,
  onGenerate,
  className = '',
  variant = 'outline',
  onAfterGenerate,
}: FakeDataGeneratorProps<T>) {
  if (!showDevFeatures()) return null

  const handleClick = () => {
    const fakeData = fakeDataGenerators[type]()
    onGenerate(fakeData as unknown as ReturnType<(typeof fakeDataGenerators)[T]>)
    onAfterGenerate?.()
  }

  return (
    <div className='flex justify-end'>
      <Button type='button' variant={variant} className={className} onClick={handleClick}>
        Auto-fill with fake data
      </Button>
    </div>
  )
}
