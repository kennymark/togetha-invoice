import { Link } from '@inertiajs/react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { getRoutePath } from '~/config/get-route-path'
import { Facebook, Twitter, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className='bg-gray-900 text-gray-300'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Company Info */}
          <div className='col-span-1 md:col-span-2'>
            <Link href={getRoutePath('home')} className='flex items-center mb-4'>
              <span className='text-2xl font-bold text-main'>Togetha</span>
              <span className='text-2xl font-bold text-white'>Invoice</span>
            </Link>
            <p className='text-sm text-gray-400 max-w-md'>
              Streamline your invoicing process with our modern, user-friendly platform. Create,
              manage, and track invoices effortlessly.
            </p>
            <div className='mt-6 flex space-x-4'>
              <a
                href='https://facebook.com/togetha'
                className='text-gray-400 hover:text-white transition-colors'
                aria-label='Facebook'>
                <Facebook className='h-6 w-6' />
              </a>
              <a
                href='https://twitter.com/togetha'
                className='text-gray-400 hover:text-white transition-colors'
                aria-label='Twitter'>
                <Twitter className='h-6 w-6' />
              </a>
              <a
                href='https://linkedin.com/company/togetha'
                className='text-gray-400 hover:text-white transition-colors'
                aria-label='LinkedIn'>
                <Linkedin className='h-6 w-6' />
              </a>
              <a
                href='mailto:contact@togetha.com'
                className='text-gray-400 hover:text-white transition-colors'
                aria-label='Email'>
                <Mail className='h-6 w-6' />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className='col-span-1'>
            <h3 className='text-sm font-semibold text-white uppercase tracking-wider mb-4'>
              Quick Links
            </h3>
            <ul className='space-y-3'>
              {quickLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className='text-sm text-gray-400 hover:text-white transition-colors duration-200'>
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className='col-span-1'>
            <h3 className='text-sm font-semibold text-white uppercase tracking-wider mb-4'>
              Stay Updated
            </h3>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='mt-12 pt-8 border-t border-gray-800'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-sm text-gray-400'>
              &copy; {new Date().getFullYear()} Togetha Invoice. All rights reserved.
            </p>
            <div className='flex gap-6'>
              {bottomLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className='text-sm text-gray-400 hover:text-white transition-colors'>
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function NewsletterForm() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Implement newsletter logic
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <p className='text-sm text-gray-400'>
        Subscribe to our newsletter for the latest updates and features.
      </p>
      <div className='flex flex-col sm:flex-row gap-2'>
        <Input
          placeholder='Enter your email'
          className='bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-600 focus:ring-gray-600'
          type='email'
          required
        />
        <Button
          type='submit'
          className='bg-main hover:bg-main/90 text-white transition-colors duration-200'>
          Subscribe
        </Button>
      </div>
    </form>
  )
}

const quickLinks = [
  { title: 'Home', href: getRoutePath('home') },
  { title: 'About', href: getRoutePath('about') },
]

const bottomLinks = [
  { title: 'Privacy Policy', href: '#' },
  { title: 'Terms of Service', href: '#' },
  { title: 'Cookie Policy', href: '#' },
]
