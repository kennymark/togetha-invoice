import { router } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'

interface PageHeaderProps {
  title: string
  description: string
  hasBackButton?: boolean
  backLink?: string
  children?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  children,
  hasBackButton,
  backLink,
}: PageHeaderProps) {
  return (
    <div className='flex items-baseline gap-1.5 mt-4 mb-8'>
      {hasBackButton && backLink && (
        <button
          type='button'
          onClick={() => router.visit(backLink)}
          className='flex items-center gap-2 text-sm text-foreground hover:text-foreground transition-colors'>
          <ArrowLeft className='h-4 w-4' />
        </button>
      )}
      <div>
        <h1 className='text-2xl font-bold text-primary'>{title}</h1>
        <p className=' text-sm'>{description}</p>
      </div>
      {children}
    </div>
  )
}
