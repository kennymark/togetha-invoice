import { Link } from '@inertiajs/react'
import { getRoutePath } from '~/config/get-route-path'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import usePageProps from '~/hooks/use-page-props'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user } = usePageProps()

  const renderAuthLinks = () => {
    if (user.email) {
      return (
        <Link
          href={getRoutePath('dashboard')}
          className='text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium'>
          Dashboard
        </Link>
      )
    }

    return (
      <div className='flex items-center space-x-4'>
        <Link
          href={getRoutePath('auth_login')}
          className='text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium'>
          Sign in
        </Link>
        <Link
          href={getRoutePath('auth_create_account')}
          className='bg-main text-white hover:bg-main/90 px-4 py-2 rounded-md text-sm font-medium'>
          Get Started
        </Link>
      </div>
    )
  }

  const renderMobileAuthLinks = () => {
    if (user.email) {
      return (
        <Link
          href={getRoutePath('dashboard')}
          className='block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50'>
          Dashboard
        </Link>
      )
    }

    return (
      <div className='pt-4 pb-3 border-t border-gray-200'>
        <div className='space-y-1'>
          <Link
            href={getRoutePath('auth_login')}
            className='block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50'>
            Sign in
          </Link>
          <Link
            href={getRoutePath('auth_create_account')}
            className='block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50'>
            Get Started
          </Link>
        </div>
      </div>
    )
  }

  return (
    <header className='bg-white shadow-sm sticky top-0 z-50'>
      <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16'>
          {/* Logo */}
          <div className='flex-shrink-0 flex items-center'>
            <Link href={getRoutePath('home')} className='flex items-center'>
              <span className='text-2xl font-bold text-main'>Togetha</span>
              <span className='text-2xl font-bold text-gray-900'>Invoice</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex md:items-center md:space-x-8'>
            <Link
              href={getRoutePath('home')}
              className='text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium'>
              Home
            </Link>
            <Link
              href={getRoutePath('about')}
              className='text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium'>
              About
            </Link>
            {renderAuthLinks()}
          </div>

          {/* Mobile menu button */}
          <div className='flex md:hidden items-center'>
            <button
              type='button'
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-main'
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <span className='sr-only'>Open main menu</span>
              {isMobileMenuOpen ? (
                <X className='h-6 w-6' aria-hidden='true' />
              ) : (
                <Menu className='h-6 w-6' aria-hidden='true' />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className='pt-2 pb-3 space-y-1'>
            <Link
              href={getRoutePath('home')}
              className='block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50'>
              Home
            </Link>
            <Link
              href={getRoutePath('about')}
              className='block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50'>
              About
            </Link>
            {renderMobileAuthLinks()}
          </div>
        </div>
      </nav>
    </header>
  )
}
