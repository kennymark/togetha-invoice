import { SEO } from '~/components/seo'
import { PageHeader } from '../_components/page-header'

export default function FinancePage() {
  return (
    <>
      <SEO
        title='Finance'
        description='View your financial overview, reports, and manage your business finances.'
        keywords='finance, financial reports, business finance, financial overview, accounting'
        ogType='website'
      />
      <PageHeader title='Finance' description='View your financial overview and reports.' />
      <div className='flex flex-col gap-8 w-full'>
        {/* Main content placeholder */}
        <div className='flex flex-col items-center justify-center h-96 text-muted-foreground'>
          Finance content coming soon...
        </div>
      </div>
    </>
  )
}
