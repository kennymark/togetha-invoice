'use client'

import { Button } from '~/components/ui/button'
import type { TableContainerProps } from './types'
import { Additem } from 'iconsax-react'
import ExportDrawer, { defaultExportOptions } from './export-drawer'

export function TableContainer({
  title,
  onCreate,
  createButtonText = 'Create',
  exportEndpoint,
}: TableContainerProps) {
  return (
    <div className='flex items-center justify-between mb-6'>
      <div className='flex items-center gap-4'>
        {title && <span className='text-lg font-semibold text-gray-900'>{title}</span>}
      </div>
      <div className='flex gap-2 items-center'>
        {exportEndpoint && (
          <ExportDrawer endpoint={exportEndpoint} exportOptions={defaultExportOptions} />
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
