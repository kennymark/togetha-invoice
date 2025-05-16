import type React from 'react'

interface DetailsValueProps {
  label: string
  children: React.ReactNode
  className?: string
}

export function DetailsValue({ label, children, className = '' }: DetailsValueProps) {
  return (
    <div className={`mb-2 ${className}`}>
      <div className='mb-1 text-sm text-gray-500 font-medium'>{label}</div>
      <div className='font-semibold'>{children}</div>
    </div>
  )
}
