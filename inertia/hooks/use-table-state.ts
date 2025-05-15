import { useState, useMemo, useCallback } from 'react'
import { useTableParams, type TableParams } from '../hooks/use-table-params'
import { defaultTableState } from '~/components/reusable/table/constants'

interface TableState {
  query: TableParams
  currentPage: number
  currentPerPage: number
  sortConfig: {
    key: string | null
    direction: 'asc' | 'desc'
  }
  handleSort: (key: string) => void
  handlePageChange: (page: number) => void
  handlePageSizeChange: (pageSize: number) => void
  handleSearch: (searchTerm: string) => void
}

export function useTableState(resourceName: string): TableState {
  // Ensure defaultTableState is properly typed and has all required fields
  const defaultState: TableParams = {
    ...defaultTableState,
  }

  const { query, changePage, changeRows, changeSort, searchTable } = useTableParams(
    defaultState,
    resourceName,
  )

  // Memoize the current values to prevent unnecessary recalculations
  const currentPage = useMemo(
    () => Number(query.page) || defaultState.page || 1,
    [query.page, defaultState.page],
  )

  const currentPerPage = useMemo(
    () => Number(query.perPage) || defaultState.perPage || 10,
    [query.perPage, defaultState.perPage],
  )

  const [sortConfig, setSortConfig] = useState<{
    key: string | null
    direction: 'asc' | 'desc'
  }>(() => ({
    key: query.sortBy || defaultState.sortBy || null,
    direction: (query.sortOrder as 'asc' | 'desc') || defaultState.sortOrder || 'asc',
  }))

  const handleSort = useCallback(
    (key: string) => {
      const newDirection = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
      setSortConfig({ key, direction: newDirection })
      changeSort(key, newDirection)
    },
    [sortConfig.key, sortConfig.direction, changeSort],
  )

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      query,
      currentPage,
      currentPerPage,
      sortConfig,
      handleSort,
      handlePageChange: changePage,
      handlePageSizeChange: changeRows,
      handleSearch: searchTable,
    }),
    [
      query,
      currentPage,
      currentPerPage,
      sortConfig,
      handleSort,
      changePage,
      changeRows,
      searchTable,
    ],
  )
}
