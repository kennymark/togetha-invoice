'use client'

import { Button } from '~/components/ui/button'
import { Export } from 'iconsax-react'
import BaseSheet from '../base-sheet'
import { FormBase, FormField, FormFooter } from '../base-form'
import { useDisclosure } from '~/hooks/use-disclosure'
import { BaseSelect } from '../base-select'
import { useForm } from 'react-hook-form'
import type { ControllerRenderProps } from 'react-hook-form'
import { useState } from 'react'
import { BaseTooltip } from '..'
import axios from 'axios'
import { toast } from 'sonner'

export interface SelectOption {
  label: string
  name: string
  options: { value: string; label: string }[]
}

type ExportFormData = {
  [K in string]: string
}

interface ExportDrawerProps {
  description?: string
  exportOptions: SelectOption[]
  endpoint: 'customers' | 'jobs' | 'invoices' | 'payments'
  btnText?: string
}

export default function ExportDrawer({
  description,
  exportOptions,
  endpoint,
  btnText = 'Export',
}: ExportDrawerProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isProcessing, setIsProcessing] = useState(false)

  const form = useForm<ExportFormData>({
    defaultValues: {
      sort: exportOptions[0]?.options[0]?.value || 'desc',
    },
  })

  const handleExport = async (formData: ExportFormData) => {
    try {
      setIsProcessing(true)
      const response = await axios.post(`/reports/${endpoint}`, formData)
      const { metadata, message } = response.data
      onClose()
      if (metadata) {
        // Create a temporary link and trigger download
        const link = document.createElement('a')
        link.href = metadata.url
        link.download = `${metadata.name || endpoint}-${Date.now()}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast.success(message || `Successfully exported ${endpoint} to CSV`)
      } else {
        toast.error('Failed to export data. No download URL received.')
      }
    } catch (error) {
      onClose()
      console.error('Export error:', error)
      toast.error(
        error.response?.data?.message || `Failed to export ${endpoint}. Please try again.`,
      )
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <BaseTooltip content='Export to CSV'>
        <Button variant='ghost' onClick={onOpen} className='rounded-full'>
          <Export color='#3D464D' size={18} />
          {btnText}
        </Button>
      </BaseTooltip>

      <BaseSheet
        open={isOpen}
        setOpen={onClose}
        title={`Export ${endpoint} to CSV`}
        description={
          description ||
          'You can select and export the data in this table to a CSV file. The file will be downloaded to your device.'
        }>
        <FormBase form={form} onSubmit={handleExport}>
          <div className='flex flex-col gap-4'>
            <h2 className='text-lg font-semibold'>Export to CSV</h2>
            <p className='text-sm text-gray-500'>
              You can select and export the data in this table to a CSV file. The file will be
              downloaded to your device.
            </p>
          </div>
          <div className='space-y-4'>
            {exportOptions?.map(({ label, name, options }) => (
              <FormField key={name} form={form} name={name} label={label}>
                {(field: ControllerRenderProps<ExportFormData, string>) => (
                  <BaseSelect
                    placeholder='Select an option'
                    items={options}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              </FormField>
            ))}
          </div>
          <FormFooter>
            <Button type='submit' disabled={isProcessing} className='w-full'>
              {isProcessing ? 'Exporting...' : 'Export to CSV'}
            </Button>
          </FormFooter>
        </FormBase>
      </BaseSheet>
    </>
  )
}

export const defaultExportOptions = [
  {
    label: 'Sort Results By',
    name: 'sort',
    options: [
      { label: 'Ascending Order', value: 'asc' },
      { label: 'Descending Order', value: 'desc' },
    ],
  },
]
