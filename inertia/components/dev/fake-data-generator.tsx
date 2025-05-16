import { faker } from '@faker-js/faker'
import { Button } from '~/components/ui'
import { showDevFeatures } from '~/lib/utils'
import type { CustomerFormValues } from '~/lib/schemas/customer'
import type { UseFormReset } from 'react-hook-form'
import type { JobFormValues } from '~/lib/schemas/jobs'

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
}: FakeDataGeneratorProps<T>) {
  if (!showDevFeatures()) return null

  const handleClick = () => {
    const fakeData = fakeDataGenerators[type]()
    onGenerate(fakeData as any) // Type assertion needed due to generic constraints
  }

  return (
    <div className='flex justify-end'>
      <Button type='button' variant={variant} className={className} onClick={handleClick}>
        Auto-fill with fake data
      </Button>
    </div>
  )
}
