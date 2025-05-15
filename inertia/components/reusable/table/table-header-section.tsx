'use client'

import { useState, useEffect } from 'react'
import { Button, Select, Switch } from '~/components/ui'
import { Filter, SearchNormal1 } from 'iconsax-react'
import { BasePopover } from '~/components/reusable/base-popover'
import { TimeSelector } from '~/components/reusable/time-selector'
import type { TableHeaderSectionProps } from './types'
import { defaultTableState } from './constants'
import useQueryParams, { updateQueryParams } from '~/hooks/use-query-params'

const dateRanges = [
  { label: 'All time', value: 'all' },
  { label: 'Last 24 hours', value: '1d' },
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 6 months', value: '180d' },
]

function getDateRangeValue(startDate: string): string {
  const now = new Date()
  const start = new Date(startDate)
  const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  if (startDate === new Date(0).toISOString().split('T')[0]) return 'all'
  if (diff <= 1) return '1d'
  if (diff <= 7) return '7d'
  if (diff <= 30) return '30d'
  if (diff <= 180) return '180d'
  return 'all'
}

export function TableHeaderSection({
  searchPlaceholder = 'Search...',
  extraFilters = [],
  noSort = false,
  noFilter = false,
  noReset = false,
  noDates = false,
  noSearch = false,
  customFilters,
  sortOptions,
  onSearch,
}: TableHeaderSectionProps & { onSearch?: (value: string) => void }) {
  const searchParams = useQueryParams()
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    if (onSearch) {
      onSearch(searchValue)
    }
  }, [searchValue, onSearch])

  // Determine selected date range from URL
  const startDate = searchParams.startDate || ''
  const selectedDateRange = getDateRangeValue(startDate)

  const handleDateRangeSelect = (value: string) => {
    const now = new Date()
    let startDate = new Date()
    switch (value) {
      case '1d':
        startDate.setDate(now.getDate() - 1)
        break
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '180d':
        startDate.setDate(now.getDate() - 180)
        break
      default:
        startDate = new Date(0) // All time
    }
    updateQueryParams({
      startDate: startDate.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0],
    })
  }

  return (
    <div className='flex flex-col gap-4 px-10 pt-8 pb-6'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        {!noSearch && (
          <div className='flex-1 min-w-[200px] max-w-[280px]'>
            <div className='flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 w-full'>
              <SearchNormal1 color='#6D747A' size={16} className='mr-2' />
              <input
                type='text'
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className='flex-1 border-none outline-none bg-transparent text-xs placeholder:text-[#6D747A] max-w-[280px]'
                style={{ fontWeight: 500 }}
              />
            </div>
          </div>
        )}
        <div className='flex items-center gap-2'>
          {!noReset && (
            <Button
              variant='ghost'
              className='rounded-full'
              onClick={() => {
                updateQueryParams(defaultTableState)
              }}>
              Reset
            </Button>
          )}
          {!noSort && sortOptions && (
            <div className='w-[200px]'>
              <Select
                value={searchParams.sortBy || defaultTableState.sortBy}
                onValueChange={(value) => updateQueryParams({ sortBy: value })}>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          )}
          {!noFilter && (
            <BasePopover
              trigger={
                <Button variant='ghost' className='gap-2 rounded-full'>
                  <Filter color='#6D747A' size={16} />
                  Filters
                </Button>
              }
              content={
                <div className='p-4 space-y-4 min-w-[200px]'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Show archived</span>
                    <Switch
                      checked={searchParams.archived === 'true'}
                      onCheckedChange={(checked) =>
                        updateQueryParams({ archived: checked.toString() })
                      }
                    />
                  </div>
                  {Array.isArray(extraFilters) &&
                    extraFilters.map((filter) => (
                      <div key={filter.value} className='flex items-center justify-between'>
                        <span className='text-sm'>{filter.label}</span>
                        <Switch
                          checked={searchParams[filter.value] === 'true'}
                          onCheckedChange={(checked) =>
                            updateQueryParams({ [filter.value]: checked.toString() })
                          }
                        />
                      </div>
                    ))}
                </div>
              }
            />
          )}
          {!noDates && (
            <div className='w-[150px]'>
              <TimeSelector
                placeholder='Date Range'
                items={dateRanges}
                value={selectedDateRange}
                onChange={handleDateRangeSelect}
              />
            </div>
          )}
        </div>
      </div>
      {customFilters}
    </div>
  )
}
