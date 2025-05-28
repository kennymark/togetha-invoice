import { SEO } from '~/components/seo'
import { PageHeader } from '../_components/page-header'
import { Card } from '~/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '~/components/ui/chart'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts'
import { Badge } from '~/components/ui/badge'
import { formatCurrency } from '~/lib/utils'
import type { PageProps } from '@inertiajs/core'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { StatsCard } from '~/components/reusable/stats-card'
import { CreditCard, Receipt, Clock, AlertCircle } from 'lucide-react'
import { BaseTable } from '~/components/reusable/table/base-table'
import { router } from '@inertiajs/react'
import { useState } from 'react'
import type { Column } from '~/components/reusable/table/types'

interface Payment {
  id: string
  title: string
  amount: number
  status: string
  created_at: string
}

interface Invoice {
  id: string
  title: string
  amount: number
  status: string
  created_at: string
  invoiceNumber: string
}

interface Stats {
  payments: {
    totalAmount: number
    pendingAmount: number
    completedAmount: number
    failedAmount: number
  }
  invoices: {
    totalAmount: number
    pendingAmount: number
    paidAmount: number
    overdueAmount: number
  }
}

interface Trend {
  date: string
  amount: number
}

interface StatusDistribution {
  status: string
  value: number
}

interface FinancePageProps extends PageProps {
  stats: Stats
  trends: {
    payments: Trend[]
    invoices: Trend[]
  }
  statusDistribution: {
    payments: StatusDistribution[]
    invoices: StatusDistribution[]
  }
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function FinancePage({ stats, trends, statusDistribution }: FinancePageProps) {
  return (
    <>
      <SEO
        title='Finance'
        description='View your financial overview, reports, and manage your business finances.'
        keywords='finance, financial reports, business finance, financial overview, accounting'
        ogType='website'
      />
      <PageHeader title='Finance' description='View your financial overview and reports.' />

      <div className='flex flex-col gap-8 w-full'>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <StatsCard
            icon={<CreditCard size={24} />}
            label='Total Payments'
            value={formatCurrency(stats.payments.totalAmount)}
          />
          <StatsCard
            icon={<Clock size={24} />}
            label='Pending Payments'
            value={formatCurrency(stats.payments.pendingAmount)}
          />
          <StatsCard
            icon={<Receipt size={24} />}
            label='Total Invoices'
            value={formatCurrency(stats.invoices.totalAmount)}
          />
          <StatsCard
            icon={<AlertCircle size={24} />}
            label='Pending Invoices'
            value={formatCurrency(stats.invoices.pendingAmount)}
          />
        </div>
        {/* Status Distribution Charts */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Payment Status Distribution */}
          <Card className='p-6'>
            <h3 className='text-lg font-semibold mb-4'>Payment Status Distribution</h3>
            {statusDistribution.payments.length === 0 ? (
              <div className='h-[300px] flex items-center justify-center text-gray-500'>
                No payment data available
              </div>
            ) : (
              <div className='h-[300px]'>
                <ChartContainer config={{ value: { label: 'Count' } }}>
                  <PieChart>
                    <Pie
                      data={statusDistribution.payments}
                      dataKey='value'
                      nameKey='status'
                      cx='50%'
                      cy='50%'
                      outerRadius={100}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                      {statusDistribution.payments.map((entry, index) => (
                        <Cell key={`cell-${entry.status}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className='bg-white p-3 rounded-lg shadow-lg border border-gray-200'>
                              <p className='text-sm font-medium text-gray-900'>{payload[0].name}</p>
                              <p className='text-sm text-gray-600'>Count: {payload[0].value}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ChartContainer>
              </div>
            )}
          </Card>

          {/* Invoice Status Distribution */}
          <Card className='p-6'>
            <h3 className='text-lg font-semibold mb-4'>Invoice Status Distribution</h3>
            {statusDistribution.invoices.length === 0 ? (
              <div className='h-[300px] flex items-center justify-center text-gray-500'>
                No invoice data available
              </div>
            ) : (
              <div className='h-[300px]'>
                <ChartContainer config={{ value: { label: 'Count' } }}>
                  <PieChart>
                    <Pie
                      data={statusDistribution.invoices}
                      dataKey='value'
                      nameKey='status'
                      cx='50%'
                      cy='50%'
                      outerRadius={100}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                      {statusDistribution.invoices.map((entry, index) => (
                        <Cell key={`cell-${entry.status}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className='bg-white p-3 rounded-lg shadow-lg border border-gray-200'>
                              <p className='text-sm font-medium text-gray-900'>{payload[0].name}</p>
                              <p className='text-sm text-gray-600'>Count: {payload[0].value}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ChartContainer>
              </div>
            )}
          </Card>
        </div>

        {/* Financial Trends Chart */}
        <Card className='p-6'>
          <h3 className='text-lg font-semibold mb-4'>Financial Trends</h3>
          <div className=' w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <ChartContainer config={{ amount: { label: 'Amount' } }}>
                <LineChart data={trends.payments}>
                  <CartesianGrid strokeDasharray='3 3' className='stroke-gray-200' />
                  <XAxis
                    dataKey='date'
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    }
                  />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => formatCurrency(value)} />
                  <ChartTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className='bg-white p-3 rounded-lg shadow-lg border border-gray-200'>
                            <p className='text-sm font-medium text-gray-900'>
                              {new Date(label).toLocaleDateString()}
                            </p>
                            <p className='text-sm text-blue-600'>
                              Payments: {formatCurrency(payload[0].value as number)}
                            </p>
                            <p className='text-sm text-green-600'>
                              Invoices: {formatCurrency(payload[1].value as number)}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line
                    type='monotone'
                    dataKey='amount'
                    name='Payments'
                    stroke='#0088FE'
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type='monotone'
                    dataKey='amount'
                    name='Invoices'
                    data={trends.invoices}
                    stroke='#00C49F'
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <ChartLegend
                    content={({ payload }) => (
                      <div className='flex justify-center gap-4 mt-4'>
                        {payload?.map((entry) => (
                          <div key={entry.value} className='flex items-center gap-2'>
                            <div
                              className='w-3 h-3 rounded-full'
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className='text-sm text-gray-600'>{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  />
                </LineChart>
              </ChartContainer>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </>
  )
}
