import { SEO } from '~/components/seo'
import { Link } from '@inertiajs/react'
import { getRoutePath } from '~/config/get-route-path'

export default function AboutPage() {
  return (
    <>
      <SEO
        title='About Togetha Invoice - Our Story'
        description='Learn about Togetha Invoice, our mission, and the team behind the platform'
      />

      {/* Hero Section */}
      <section className='bg-white py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h1 className='text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl'>
              <span className='block'>About</span>
              <span className='block text-main'>Togetha Invoice</span>
            </h1>
            <p className='mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl'>
              We're on a mission to simplify invoicing for businesses of all sizes, making financial
              management more accessible and efficient.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className='py-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='lg:text-center'>
            <h2 className='text-base text-main font-semibold tracking-wide uppercase'>Our Story</h2>
            <p className='mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl'>
              Building the Future of Invoicing
            </p>
            <p className='mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto'>
              Togetha Invoice was born from a simple observation: businesses were spending too much
              time on manual invoicing processes. We set out to create a solution that would make
              invoicing as simple as possible while maintaining professional standards.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className='py-12 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='lg:text-center mb-12'>
            <h2 className='text-base text-main font-semibold tracking-wide uppercase'>
              Our Values
            </h2>
            <p className='mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl'>
              What Drives Us
            </p>
          </div>

          <div className='mt-10'>
            <div className='space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10'>
              {values.map((value) => (
                <div key={value.name} className='relative'>
                  <div className='absolute flex items-center justify-center h-12 w-12 rounded-md bg-main text-white'>
                    {value.icon}
                  </div>
                  <p className='ml-16 text-lg leading-6 font-medium text-gray-900'>{value.name}</p>
                  <p className='mt-2 ml-16 text-base text-gray-500'>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className='py-12 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='lg:text-center mb-12'>
            <h2 className='text-base text-main font-semibold tracking-wide uppercase'>Our Team</h2>
            <p className='mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl'>
              The People Behind Togetha
            </p>
          </div>

          <div className='mt-10'>
            <div className='space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10'>
              {team.map((member) => (
                <div key={member.name} className='text-center'>
                  <div className='h-40 w-40 rounded-full mx-auto bg-main/10 flex items-center justify-center text-4xl'>
                    {member.avatar}
                  </div>
                  <h3 className='mt-6 text-lg font-medium text-gray-900'>{member.name}</h3>
                  <p className='text-sm text-main'>{member.role}</p>
                  <p className='mt-2 text-base text-gray-500'>{member.bio}</p>
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
            <span className='block'>Join Our Journey</span>
            <span className='block'>Start using Togetha Invoice today</span>
          </h2>
          <p className='mt-4 text-lg leading-6 text-main-200'>
            Experience the difference with our modern invoicing solution.
          </p>
          <Link
            href={getRoutePath('auth_create_account')}
            className='mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-main bg-white hover:bg-main/10 sm:w-auto'>
            Get Started
          </Link>
        </div>
      </section>
    </>
  )
}

const values = [
  {
    name: 'Simplicity',
    description: 'We believe in making complex processes simple and accessible to everyone.',
    icon: '✨',
  },
  {
    name: 'Innovation',
    description: 'Constantly evolving and improving our platform to meet modern business needs.',
    icon: '🚀',
  },
  {
    name: 'Reliability',
    description: 'Building trust through consistent, reliable service and support.',
    icon: '🛡️',
  },
]

const team = [
  {
    name: 'John Doe',
    role: 'Founder & CEO',
    bio: 'Passionate about simplifying business processes and helping companies grow.',
    avatar: '👨‍💼',
  },
  {
    name: 'Jane Smith',
    role: 'Head of Product',
    bio: 'Dedicated to creating intuitive and powerful user experiences.',
    avatar: '👩‍💼',
  },
  {
    name: 'Mike Johnson',
    role: 'Lead Developer',
    bio: 'Expert in building scalable and secure financial applications.',
    avatar: '👨‍💻',
  },
]
