import { Button } from '~/components/ui'
import { BasePopover, BaseAvatar, BaseDropdown } from '~/components/reusable'
import { ArrowDown, Menu } from 'lucide-react'
import { Logout, Notification } from 'iconsax-react'
import usePageProps from '~/hooks/use-page-props'
import { router } from '@inertiajs/react'
import FlashMessages from '~/components/flash-messages'
import { useSidebar } from '~/components/ui/sidebar'
import DevEmails from '~/components/dev-emails'

interface QuickAction {
  label: string
  onClick: () => void
}

const quickActions: QuickAction[] = [
  {
    label: 'Create invoice',
    onClick: () => {
      router.visit('/dashboard/invoices/create')
    },
  },
  {
    label: 'Create payment link',
    onClick: () => {
      router.visit('/dashboard/payments/create')
    },
  },
  {
    label: 'Add a customer',
    onClick: () => {
      router.visit('/dashboard/customers/create')
    },
  },
]

export default function Header() {
  const { user } = usePageProps()

  const { toggleSidebar } = useSidebar()
  return (
    <>
      <FlashMessages />
      <header className='h-[72px] bg-white'>
        <div className='h-full px-4 flex items-center justify-between'>
          <Menu className='size-5 block md:hidden' onClick={toggleSidebar} />
          <div className='flex items-center gap-4 justify-end w-full'>
            <BaseDropdown
              trigger={
                <Button
                  variant='secondary'
                  size='sm'
                  className='flex items-center gap-2 rounded-full text-sm'>
                  <ArrowDown className='size-4' />
                  Quick actions
                </Button>
              }
              items={quickActions}
              align='end'
              side='bottom'
            />
            <DevEmails />
            <BasePopover
              trigger={
                <Button
                  variant='ghost'
                  size='icon'
                  aria-label='Open notifications'
                  className='relative'>
                  <Notification color='black' className='size-5' />
                  <span className='absolute top-1 right-1 text-white text-[8px] flex justify-center items-center h-3 w-3 rounded-full bg-main '>
                    6
                  </span>
                </Button>
              }
              content={
                <div className='min-w-[260px] p-4 flex flex-col gap-2 bg-white rounded-[12px] min-h-[200px]'>
                  <span className='text-sm font-semibold'>Notifications</span>
                  <span className='text-xs text-muted-foreground'>No new notifications</span>
                </div>
              }
            />
            <BasePopover
              trigger={
                <Button
                  variant='ghost'
                  size='icon'
                  aria-label='Open user menu'
                  className='relative hover:rounded-full'>
                  <BaseAvatar size='md' alt='User' name={user?.fullName} />
                </Button>
              }
              content={
                <div className='min-w-[260px] p-4 flex flex-col gap-4 bg-white rounded-[12px]'>
                  <div className='flex items-center gap-3'>
                    <BaseAvatar size='md' alt='User' name={user?.fullName} />
                    <div className='flex flex-col'>
                      <span className='text-sm font-semibold'>{user?.fullName}</span>
                      <span className='text-xs text-muted-foreground'>{user?.email}</span>
                    </div>
                  </div>
                  <Button
                    variant='ghost'
                    className='w-full justify-start gap-2 bg-secondary/20   hover:bg-main/20 font-normal'
                    onClick={() => {
                      router.post('/logout')
                    }}>
                    <Logout className='size-4' color='gray' />
                    Signout
                  </Button>
                </div>
              }
            />
          </div>
        </div>
      </header>
    </>
  )
}
