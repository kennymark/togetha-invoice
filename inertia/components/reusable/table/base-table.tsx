'use client'

import { useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { Button } from '~/components/ui/button'
import { ChevronsUpDown } from 'lucide-react'
import type { BaseTableProps } from './types'
import { TableContainer } from './table-container'
import { TableHeaderSection } from './table-header-section'
import { PaginationSection } from './pagination-section'
import { compareValues } from '~/hooks/table-helpers'
import { getNestedValue } from '~/hooks/table-helpers'

export function BaseTable<T extends { id: string | number }>({
  data,
  columns,
  isLoading = false,
  emptyMessage = 'No data available',
  className = '',
  containerClassName = '',
  title,
  createButtonText,
  isNumbered = false,
  searchPlaceholder,
  onExport,
  onCreate,
  extraFilters,
  noFilter,
  noReset,
  noSearch,
  noDates,
  customFilters,
  currentPage,
  currentPerPage,
  sortConfig,
  onSort,
  onPageChange,
  onPageSizeChange,
  onSearch,
}: BaseTableProps<T>) {
  const sortedData = useMemo(() => {
    const items = [...data]
    if (!sortConfig.key) return items
    return items.sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key ?? '')
      const bValue = getNestedValue(b, sortConfig.key ?? '')
      return compareValues(aValue, bValue, sortConfig.direction)
    })
  }, [data, sortConfig])

  // Paginate the sorted data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * currentPerPage
    const end = start + currentPerPage
    return sortedData.slice(start, end)
  }, [sortedData, currentPage, currentPerPage])

  if (isLoading) {
    return (
      <div className={`w-full h-48 flex items-center justify-center ${containerClassName}`}>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary' />
      </div>
    )
  }

  return (
    <div className={`${containerClassName}`}>
      <TableContainer
        title={title}
        onExport={onExport}
        onCreate={onCreate}
        createButtonText={createButtonText}
      />
      <div className='flex flex-col  bg-white rounded-[12px] border border-[#E7E8E9]'>
        <TableHeaderSection
          searchPlaceholder={searchPlaceholder}
          extraFilters={extraFilters}
          noFilter={noFilter}
          noReset={noReset}
          noSearch={noSearch}
          noDates={noDates}
          customFilters={customFilters}
          onSearch={onSearch}
        />
        <Table className={className}>
          <TableHeader className='text-white-70 text-[10px] leading-[13.66px] font-normal'>
            <TableRow className='hover:bg-transparent'>
              {isNumbered && (
                <TableHead className='w-[40px] text-center border-r border-white-15'>#</TableHead>
              )}
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  className={`
                    text-[#3D464D] text-sm font-bold
                    ${column.width || ''} 
                    ${column.align ? `text-${column.align}` : ''}
                    ${column.hideOnMobile ? 'hidden sm:table-cell' : ''}
                    ${column.hideOnTablet ? 'hidden md:table-cell' : ''}
                  `}>
                  {column.sortable ? (
                    <Button
                      onClick={() => onSort(column.key)}
                      variant={'ghost'}
                      className='p-0 text-[#3D464D] text-sm font-bold hover:bg-transparent !px-0'>
                      {column.title}
                      <ChevronsUpDown className='ml-1 h-2 w-2 text-white-70' />
                    </Button>
                  ) : (
                    column.title
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className='text-xs leading-[16.3px] font-medium'>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isNumbered ? columns.length + 1 : columns.length}
                  className='h-24 text-center text-muted-foreground'>
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, rowIndex) => (
                <TableRow key={item.id}>
                  {isNumbered && (
                    <TableCell className='w-[40px] text-center border-r border-white-15'>
                      {(currentPage - 1) * currentPerPage + rowIndex + 1}
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={`
                        ${column.align ? `text-${column.align}` : ''}
                        ${column.hideOnMobile ? 'hidden sm:table-cell' : ''}
                        ${column.hideOnTablet ? 'hidden md:table-cell' : ''}
                      `}>
                      {column.actions ? (
                        <div className='flex justify-end'>{column.actions(item).menu}</div>
                      ) : column.render ? (
                        column.render(getNestedValue(item, column.key), item)
                      ) : (
                        String(getNestedValue(item, column.key) ?? '')
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <PaginationSection
          page={currentPage}
          pageSize={currentPerPage}
          total={sortedData.length}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  )
}
