import { SEO } from '~/components/seo'

export default function AboutPage() {
  return (
    <>
      <SEO title='About - Template' description='About this template' />
      <div className='bg-white shadow rounded-lg p-6'>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>About This Template</h1>
        <div className='prose max-w-none'>
          <p className='text-gray-600 mb-4'>
            This is a minimal React template built with modern tools and best practices.
          </p>
          <div className='bg-gray-50 p-4 rounded-md'>
            <h2 className='text-xl font-semibold text-gray-800 mb-2'>Features</h2>
            <ul className='list-disc list-inside text-gray-600 space-y-2'>
              <li>React with TypeScript</li>
              <li>React Router for navigation</li>
              <li>Tailwind CSS for styling</li>
              <li>Error boundary for error handling</li>
              <li>React Helmet for meta tags</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
