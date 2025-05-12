'use client'

import { Button } from '~/components/ui/button'
import type { TableContainerProps } from './types'
import { Additem, Export } from 'iconsax-react'

export function TableContainer({
  title,
  onExport,
  onCreate,
  createButtonText = 'Create',
}: TableContainerProps) {
  return (
    <div className='flex items-center justify-between mb-6'>
      <div className='flex items-center gap-4'>
        {title && <span className='text-lg font-semibold text-gray-900'>{title}</span>}
      </div>
      <div className='flex gap-2 items-center'>
        {onExport && (
          <Button variant='ghost' onClick={onExport} className='rounded-full'>
            <Export color='#3D464D' size={18} />
            Export
          </Button>
        )}
        {onCreate && (
          <Button onClick={onCreate} className='bg-primary text-white rounded-full'>
            <Additem color='white' size={18} />
            {createButtonText}
          </Button>
        )}
      </div>
    </div>
  )
}
