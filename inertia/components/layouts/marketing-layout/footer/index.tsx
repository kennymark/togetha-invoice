import { Link } from '@inertiajs/react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { getRoutePath } from '~/config/get-route-path'

export default function Footer() {
  return (
    <footer className='w-full bg-gray-900 text-gray-300'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div className='col-span-1 md:col-span-2'>
            <h1 className='text-2xl font-bold text-white'>Template</h1>
            <p className='text-sm text-gray-400 max-w-md'>
              A modern template for your next project. Built with the latest technologies and best
              practices.
            </p>
          </div>

          <div className='col-span-1'>
            <h3 className='text-sm font-semibold text-white uppercase tracking-wider mb-4'>
              Navigation
            </h3>
            <FooterLinks />
          </div>

          <div className='col-span-1'>
            <h3 className='text-sm font-semibold text-white uppercase tracking-wider mb-4'>
              Newsletter
            </h3>
            <NewsletterForm />
          </div>
        </div>

        <div className='mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-sm text-gray-400'>
            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
          <div className='flex gap-6'>
            <Link
              href={getRoutePath('dashboard_customers_individual', { customerId: 'id' })}
              className='text-sm text-gray-400 hover:text-white transition-colors'>
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function NewsletterForm() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Implement newsletter logic or leave as placeholder
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <p className='text-sm text-gray-400'>Stay updated with our latest news and updates.</p>
      <div className='flex flex-col sm:flex-row gap-2'>
        <Input
          placeholder='Enter your email'
          className='bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-600 focus:ring-gray-600'
          type='email'
          required
        />
        <Button
          type='submit'
          className='bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200'>
          Subscribe
        </Button>
      </div>
    </form>
  )
}

function FooterLinks() {
  return (
    <ul className='space-y-3'>
      {footerLinks.map((section) => (
        <li key={section.title}>
          <Link
            href={section.href}
            className='text-sm text-gray-400 hover:text-white transition-colors duration-200'>
            {section.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}

const footerLinks = [
  { title: 'Home', href: getRoutePath('home') },
  { title: 'About', href: getRoutePath('about') },
]
