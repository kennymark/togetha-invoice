import { SEO } from '~/components/seo'
import { PageHeader } from '../_components/page-header'

export default function SettingsPage() {
  return (
    <>
      <SEO title='Settings' description='Configure your account and application preferences.' />
      <PageHeader
        title='Settings'
        description='Configure your account and application preferences.'
      />
      <div className='flex flex-col gap-8 w-full'>
        {/* Main content placeholder */}

        <div className='flex flex-col items-center justify-center h-96 text-muted-foreground'>
          Settings content coming soon...
        </div>
      </div>
    </>
  )
}
