import { useCallback, useRef, useMemo, useEffect } from 'react'
import { router } from '@inertiajs/react'
import useQueryParams from './use-query-params'

export interface TableParams {
  page?: number
  perPage?: number
  startDate?: string
  endDate?: string
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  [key: string]: string | number | boolean | undefined
}

function useDebounce(callback: (value: string) => void, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  return useCallback(
    (value: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(value)
      }, delay)
    },
    [callback, delay],
  )
}

export function useTableParams(prevSearchParams: TableParams) {
  const urlParams = useQueryParams()
  const isUpdatingRef = useRef(false)
  const hasInitializedRef = useRef(false)

  // Initialize params with default values if they don't exist
  useEffect(() => {
    if (hasInitializedRef.current) return

    const hasParams = Object.keys(urlParams).length > 0
    const hasDefaultParams = Object.keys(prevSearchParams).length > 0

    if (!hasParams && hasDefaultParams) {
      hasInitializedRef.current = true
      const url = new URL(window.location.href)
      for (const [key, value] of Object.entries(prevSearchParams)) {
        if (value !== undefined && value !== '') {
          url.searchParams.set(key, String(value))
        }
      }
      window.history.replaceState({}, '', url.toString())
    }
  }, [urlParams, prevSearchParams])

  // Only parse the URL params once and memoize them
  const parsedQuery = useMemo(() => {
    const params: TableParams = {}
    for (const [key, value] of Object.entries(urlParams)) {
      // Convert numeric values
      if (!Number.isNaN(Number(value))) {
        params[key] = Number(value)
      } else {
        params[key] = value
      }
    }
    return params
  }, [urlParams])

  const updateParams = useCallback(
    (params: Partial<TableParams>) => {
      if (isUpdatingRef.current) return

      isUpdatingRef.current = true
      try {
        const newParams = { ...urlParams, ...params }

        // Remove undefined or empty values
        for (const key of Object.keys(newParams)) {
          if (newParams[key] === undefined || newParams[key] === '') {
            delete newParams[key]
          }
        }

        // Only update if params actually changed
        const currentParams = new URLSearchParams(window.location.search)
        const paramsChanged = Object.entries(newParams).some(([key, value]) => {
          return currentParams.get(key) !== String(value)
        })

        if (paramsChanged) {
          router.visit(window.location.pathname, {
            data: newParams,
            preserveScroll: true,
            preserveState: true,
            replace: true,
            onFinish: () => {
              isUpdatingRef.current = false
            },
            onError: () => {
              isUpdatingRef.current = false
            },
            onCancel: () => {
              isUpdatingRef.current = false
            },
          })
        } else {
          isUpdatingRef.current = false
        }
      } catch (error) {
        isUpdatingRef.current = false
      }
    },
    [urlParams],
  )

  const changePage = useCallback(
    (page: number) => {
      updateParams({ page })
    },
    [updateParams],
  )

  const changeRows = useCallback(
    (perPage: number) => {
      updateParams({ perPage, page: 1 })
    },
    [updateParams],
  )

  const changeDates = useCallback(
    (startDate: string | null, endDate: string | null) => {
      const updatedStartDate = startDate ?? ''
      const updatedEndDate = endDate ?? ''
      updateParams({ startDate: updatedStartDate, endDate: updatedEndDate })
    },
    [updateParams],
  )

  const updateSearch = useCallback(
    (search: string) => {
      updateParams({ search })
    },
    [updateParams],
  )

  const debouncedUpdateParams = useDebounce(updateSearch, 300)

  const searchTable = useCallback(
    (search: string) => {
      debouncedUpdateParams(search)
    },
    [debouncedUpdateParams],
  )

  const changeSort = useCallback(
    (sortBy: string, sortOrder: 'asc' | 'desc') => {
      updateParams({ sortBy, sortOrder })
    },
    [updateParams],
  )

  // Combine params only when needed for display
  const combinedQuery = useMemo(
    () => ({
      ...prevSearchParams,
      ...parsedQuery,
    }),
    [prevSearchParams, parsedQuery],
  )

  return {
    query: combinedQuery,
    combinedQuery,
    updateQuery: updateParams,
    changePage,
    changeRows,
    changeDates,
    searchTable,
    changeSort,
  }
}
