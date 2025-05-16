import type React from 'react'
import { PageHeader } from '../../pages/dashboard/_components/page-header'
import BaseDropdown from './base-dropdown'
import { ChevronDownCircle, MoreVertical } from 'lucide-react'
import { Button } from '../ui'

interface Action {
  name: string
  onClick: () => void
}

interface DetailsLayoutProps {
  title: string
  description?: string
  actions?: Action[]
  children: React.ReactNode
  hasBackButton?: boolean
  backLink?: string
}

export function DetailsLayout({
  title,
  description,
  actions = [],
  children,
  hasBackButton,
  backLink,
}: DetailsLayoutProps) {
  const dropdownItems = actions.map((action) => ({
    label: action.name,
    onClick: action.onClick,
  }))

  return (
    <div>
      <PageHeader
        title={title}
        description={description || ''}
        hasBackButton={hasBackButton}
        backLink={backLink}>
        {actions.length > 0 && (
          <BaseDropdown
            trigger={
              <Button variant='ghost' size='sm'>
                <ChevronDownCircle className='w-4 h-4' />
                Actions
              </Button>
            }
            items={dropdownItems}
          />
        )}
      </PageHeader>
      <div className='max-w-[655px] bg-white rounded-xl shadow p-8 mt-6'>{children}</div>
    </div>
  )
}
