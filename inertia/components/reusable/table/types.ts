import type { ReactNode } from 'react'

export interface Column<T> {
  key: string
  title: string
  render?: (value: unknown, item: T) => ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
  hideOnMobile?: boolean
  hideOnTablet?: boolean
  sortable?: boolean
  actions?: (item: T) => { menu: ReactNode }
}

export interface TableState {
  page: number
  perPage: number
  startDate: string
  endDate: string
  search: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  archived: boolean
  [key: string]: string | number | boolean | undefined
}

export interface ExtraFilter {
  label: string
  value: string
}

export interface BaseTableProps<T extends { id: string | number }> {
  resourceName: string
  data: T[]
  columns: Column<T>[]
  isLoading?: boolean
  emptyMessage?: string
  className?: string
  containerClassName?: string
  title?: string
  createButtonText?: string
  isNumbered?: boolean
  searchPlaceholder?: string
  onExport?: () => void
  onCreate?: () => void
  extraFilters?: ExtraFilter[]
  noFilter?: boolean
  noReset?: boolean
  noSearch?: boolean
  noDates?: boolean
  customFilters?: ReactNode
  currentPage: number
  currentPerPage: number
  sortConfig: {
    key: string | null
    direction: 'asc' | 'desc'
  }
  onSort: (key: string) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onSearch: (searchTerm: string) => void
}

export interface TableContainerProps {
  title?: string
  onCreate?: () => void
  createButtonText?: string
  exportEndpoint?: 'customers' | 'jobs' | 'invoices' | 'payments'
}

export interface TableHeaderSectionProps {
  resourceName: string
  searchPlaceholder?: string
  extraFilters?: ExtraFilter[]
  noSort?: boolean
  noFilter?: boolean
  noReset?: boolean
  noDates?: boolean
  noSearch?: boolean
  customFilters?: ReactNode
  sortOptions?: Array<{
    value: string
    label: string
    sortOrder: 'asc' | 'desc'
  }>
  onSearch?: (value: string) => void
}

export interface PaginationSectionProps {
  page: number
  pageSize: number
  total: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
}
