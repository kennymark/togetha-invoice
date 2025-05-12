import { router } from '@inertiajs/react'
import { useCallback, useEffect, useState } from 'react'
import type { ModelObject } from '@adonisjs/lucid/types/model'
import useQueryParams from './use-query-params'
import { debounce } from './use-debounce'

export const useInertiaParams = (initialQueryParams: ModelObject = {}, only?: string[]) => {
  const urlParams = useQueryParams()
  const [isLoading, setIsLoading] = useState(false)

  const [query, setQuery] = useState<ModelObject>(() => ({
    ...initialQueryParams,
    ...urlParams,
  }))

  const updateParams = (params: ModelObject) => {
    router.visit(window.location.pathname, {
      preserveScroll: true,
      // preserveState: true,
      // replace: true,
      data: params,

      onStart: () => setIsLoading(true),
      onFinish: () => setIsLoading(false),
      headers: {
        // cache for 5 minutes
        'Cache-Control': 'max-age=300',
      },
    })
  }

  useEffect(() => {
    const handlePopState = () => {
      setQuery((prevQuery) => ({
        ...initialQueryParams,
        ...urlParams,
        ...prevQuery,
      }))
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [initialQueryParams, urlParams])

  const updateQuery = useCallback(
    (newParams: ModelObject) => {
      const updatedQuery = { ...query, ...newParams }
      setQuery(updatedQuery)
      updateParams(updatedQuery)
    },
    [query],
  )

  const changePage = useCallback((page: number) => updateQuery({ page }), [updateQuery])

  const changeRows = useCallback((perPage: number) => updateQuery({ perPage }), [updateQuery])

  const changeDates = useCallback(
    (startDate: string, endDate: string) => updateQuery({ startDate, endDate }),
    [updateQuery],
  )

  const searchTable = debounce((search: string) => {
    updateQuery({ search })
  }, 300)

  return {
    query,
    changePage,
    changeRows,
    changeDates,
    isLoading,
    updateQuery,
    searchTable,
  }
}
