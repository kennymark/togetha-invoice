import { Link } from '@inertiajs/react'
import { getRoutePath } from '~/config/get-route-path'

export default function Header() {
  return (
    <header className='w-full flex justify-center '>
      <nav className='bg-white shadow-sm rounded-lg'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16'>
            <div className='flex'>
              <div className='flex-shrink-0 flex items-center'>
                <Link href={getRoutePath('home')} className='text-xl font-bold text-gray-900'>
                  Template
                </Link>
              </div>
              <div className=' ml-6 flex space-x-8'>
                <Link
                  href={getRoutePath('home')}
                  className='border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'>
                  Home
                </Link>
                <Link
                  href={getRoutePath('dashboard')}
                  className='border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'>
                  Dashboard
                </Link>
                <Link
                  href={getRoutePath('about')}
                  className='border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'>
                  About
                </Link>
                <Link
                  href={getRoutePath('auth_create_account')}
                  className='border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'>
                  Create Account
                </Link>
                <Link
                  href={getRoutePath('auth_login')}
                  className='border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'>
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
