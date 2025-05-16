import { SEO } from '~/components/seo'
import { Link } from '@inertiajs/react'
import { getRoutePath } from '~/config/get-route-path'

export default function LandingPage() {
  return (
    <>
      <SEO
        title='Togetha Invoice - Simplify Your Invoicing'
        description='Streamline your invoicing process with Togetha Invoice'
      />

      {/* Hero Section */}
      <section className='bg-white py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h1 className='text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl'>
              <span className='block'>Simplify Your</span>
              <span className='block text-main'>Invoicing Process</span>
            </h1>
            <p className='mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl'>
              Streamline your business operations with our easy-to-use invoicing platform. Create,
              manage, and track invoices effortlessly.
            </p>
            <div className='mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8'>
              <div className='rounded-md shadow'>
                <Link
                  href={getRoutePath('auth_create_account')}
                  className='w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-main hover:bg-main/90 md:py-4 md:text-lg md:px-10'>
                  Get Started
                </Link>
              </div>
              <div className='mt-3 rounded-md shadow sm:mt-0 sm:ml-3'>
                <Link
                  href={getRoutePath('auth_login')}
                  className='w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-main bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10'>
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='lg:text-center'>
            <h2 className='text-base text-main font-semibold tracking-wide uppercase'>Features</h2>
            <p className='mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl'>
              Everything you need to manage your invoices
            </p>
          </div>

          <div className='mt-10'>
            <div className='space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10'>
              {features.map((feature) => (
                <div key={feature.name} className='relative'>
                  <div className='absolute flex items-center justify-center h-12 w-12 rounded-md bg-main text-white'>
                    {feature.icon}
                  </div>
                  <p className='ml-16 text-lg leading-6 font-medium text-gray-900'>
                    {feature.name}
                  </p>
                  <p className='mt-2 ml-16 text-base text-gray-500'>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-main'>
        <div className='max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8'>
          <h2 className='text-3xl font-extrabold text-white sm:text-4xl'>
            <span className='block'>Ready to get started?</span>
            <span className='block'>Create your account today.</span>
          </h2>
          <p className='mt-4 text-lg leading-6 text-main-200'>
            Join thousands of businesses that trust Togetha Invoice for their invoicing needs.
          </p>
          <Link
            href={getRoutePath('auth_create_account')}
            className='mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-main bg-white hover:opacity-90 sm:w-auto'>
            Sign up for free
          </Link>
        </div>
      </section>
    </>
  )
}

const features = [
  {
    name: 'Easy Invoice Creation',
    description: 'Create professional invoices in minutes with our intuitive interface.',
    icon: '📝',
  },
  {
    name: 'Customer Management',
    description: 'Keep track of all your customers and their information in one place.',
    icon: '👥',
  },
  {
    name: 'Payment Tracking',
    description: 'Monitor payment status and send reminders automatically.',
    icon: '💰',
  },
  {
    name: 'Business Reports',
    description: 'Generate detailed reports to analyze your business performance.',
    icon: '📊',
  },
]
