import type { TableState } from './types'

export const defaultTableState: TableState = {
  page: 1,
  perPage: 10,
  startDate: '',
  endDate: '',
  search: '',
  sortBy: 'created_at',
  sortOrder: 'desc',
  archived: false,
}
