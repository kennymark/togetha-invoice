interface PageHeaderProps {
  title: string
  description: string
  children?: React.ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className='flex items-center justify-between mt-4 mb-8'>
      <div>
        <h1 className='text-2xl font-bold text-primary'>{title}</h1>
        <p className=' text-sm'>{description}</p>
      </div>
      {children}
    </div>
  )
}
