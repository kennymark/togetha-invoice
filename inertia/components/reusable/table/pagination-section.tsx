'use client'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '~/components/ui/pagination'
import type { PaginationSectionProps } from './types'
import { BaseSelect } from '~/components/reusable/base-select'

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100]

function PaginationSection({
  page = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
  onPageSizeChange,
}: PaginationSectionProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  function handlePageChange(newPage: number) {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) onPageChange?.(newPage)
  }

  return (
    <div className='flex flex-col sm:flex-row items-center justify-end gap-4 sm:gap-8 px-4  py-2 pt-8 sm:pt-12 bg-background-secondary rounded-b-[12px] text-xs'>
      <div className='flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start'>
        <span className='font-semibold text-xs'>Items per page</span>
        <BaseSelect
          value={String(pageSize)}
          onChange={(v) => onPageSizeChange?.(Number(v))}
          items={PAGE_SIZE_OPTIONS.map((size) => ({ value: String(size), label: String(size) }))}
          triggerClassName='w-[60px] h-7 px-0 text-center rounded-md border-none bg-transparent shadow-none focus:ring-0 focus:outline-none cursor-pointer hover:bg-secondary'
          contentClassName='min-w-[2.5rem]'
          itemClassName='text-center'
          removeChevron={false}
          placeholder=''
          selectedItemRenderer={(value) => (
            <span className='text-sm font-medium w-full text-center'>{value}</span>
          )}
        />
      </div>

      <div className='w-full sm:w-auto text-center sm:text-left'>
        {total > 0 && (
          <span className='font-semibold text-xs'>
            {from} - {to} of {total}
          </span>
        )}
      </div>

      <Pagination className='w-full sm:w-auto'>
        <PaginationContent className='flex-wrap justify-center sm:justify-end'>
          <PaginationItem>
            <PaginationLink
              role='button'
              aria-label='First page'
              tabIndex={page === 1 ? -1 : 0}
              aria-disabled={page === 1}
              isActive={false}
              onClick={() => handlePageChange(1)}>
              First
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationPrevious
              role='button'
              aria-disabled={page === 1}
              tabIndex={page === 1 ? -1 : 0}
              onClick={() => handlePageChange(page - 1)}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              role='button'
              aria-disabled={page === totalPages}
              tabIndex={page === totalPages ? -1 : 0}
              onClick={() => handlePageChange(page + 1)}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              role='button'
              aria-label='Last page'
              tabIndex={page === totalPages ? -1 : 0}
              aria-disabled={page === totalPages}
              isActive={false}
              onClick={() => handlePageChange(totalPages)}>
              Last
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export { PaginationSection }
