export default function NotFound() {
  const navigate = useNavigate()

  return (
    <>
      <SEO
        title='Page Not Found - Template'
        description="The page you're looking for doesn't exist or has been moved."
      />
      <div className='min-h-screen flex flex-col items-center justify-center  text-white p-4'>
        <div className='text-center max-w-2xl'>
          <h1 className='text-6xl md:text-8xl font-bold mb-4 font-phosphate'>404</h1>
          <h2 className='text-2xl md:text-3xl font-semibold mb-6'>Oops! Page Not Found</h2>
          <p className='text-gray-400 mb-8 text-lg'>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button
              type='button'
              onClick={() => navigate(-1)}
              className='px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors'>
              Go Back
            </button>
            <button
              type='button'
              onClick={() => navigate('/')}
              className='px-6 py-3 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/80 transition-colors'>
              Return Home
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
