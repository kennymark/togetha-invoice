import { SEO } from '~/components/seo'

export default function HomePage() {
  return (
    <>
      <SEO title='Home - Template' description='Home page' />
      <div className='bg-white shadow rounded-lg p-6'>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>Welcome to Your Template</h1>
        <p className='text-gray-600 mb-4'>
          This is a minimal template to help you get started with your project.
        </p>
        <div className='bg-gray-50 p-4 rounded-md'>
          <h2 className='text-xl font-semibold text-gray-800 mb-2'>Getting Started</h2>
          <ul className='list-disc list-inside text-gray-600 space-y-2'>
            <li>
              Edit the pages in the <code className='bg-gray-200 px-1 rounded'>src/pages</code>{' '}
              directory
            </li>
            <li>
              Add your components in the{' '}
              <code className='bg-gray-200 px-1 rounded'>src/components</code> directory
            </li>
            <li>
              Customize the layout in <code className='bg-gray-200 px-1 rounded'>src/layouts</code>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
