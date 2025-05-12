import BaseSheet from '~/components/reusable/base-sheet'

interface EarningsSheetProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function EarningsSheet({ open, setOpen }: EarningsSheetProps) {
  return (
    <BaseSheet
      open={open}
      setOpen={setOpen}
      title='Earnings Details'
      description='View your earnings breakdown'>
      <div className='p-4'>
        <h3 className='text-lg font-semibold mb-4'>Earnings Breakdown</h3>
        <div className='space-y-4'>
          <div className='flex justify-between items-center'>
            <span>Total Earnings</span>
            <span className='font-medium'>£5,000</span>
          </div>
          <div className='flex justify-between items-center'>
            <span>Paid Invoices</span>
            <span className='font-medium'>£4,200</span>
          </div>
          <div className='flex justify-between items-center'>
            <span>Pending Payments</span>
            <span className='font-medium'>£800</span>
          </div>
        </div>
      </div>
    </BaseSheet>
  )
}
