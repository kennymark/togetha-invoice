/**
 * A reusable dropdown menu component built on top of shadcn/ui DropdownMenu.
 * Supports navigation links, click actions, icons, and custom positioning.
 * Automatically handles route changes and cleanup.
 *
 * @example
 * ```tsx
 * <BaseDropdown
 *   trigger={<Button>Menu</Button>}
 *   items={[
 *     { label: 'Profile', to: '/profile', icon: <UserIcon /> },
 *     { label: 'Settings', onClick: () => handleSettings(), icon: <SettingsIcon /> },
 *     { label: 'Logout', onClick: () => handleLogout(), icon: <LogoutIcon /> }
 *   ]}
 *   align="end"
 *   side="bottom"
 *   header={<UserInfo />}
 * />
 * ```
 */
'use client'

import { type ReactNode, useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Link } from '@inertiajs/react'

interface DropdownItemProps {
  /** Optional route path for navigation items */
  to?: string
  /** Click handler for action items */
  onClick?: () => void
  /** Optional icon to display before the label */
  icon?: React.ElementType
  /** Display text for the menu item */
  label: string
  /** Whether to prevent the dropdown from closing when this item is clicked */
  preventClose?: boolean
}

interface CustomDropdownProps {
  /** The trigger element that opens the dropdown (usually a button) */
  trigger: ReactNode
  /** Array of menu items to display */
  items: DropdownItemProps[]
  /** Additional CSS classes for the dropdown content */
  className?: string
  /** Horizontal alignment of the dropdown relative to the trigger */
  align?: 'start' | 'center' | 'end'
  /** Position of the dropdown relative to the trigger */
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** Optional header content to display above the menu items */
  header?: ReactNode
}

function BaseDropdown({
  trigger,
  items,
  className = '',
  align = 'end',
  side = 'bottom',
  header,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setIsOpen(false)
    }
  }, [])

  // Handle route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false)
    }

    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        className={`px-2 py-4 rounded-[12px] min-w-[220px] bg-white  border-none ${className}`}
        align={align}
        sideOffset={10}
        side={side}
        onCloseAutoFocus={(event) => {
          event.preventDefault()
        }}>
        {header && (
          <div className='flex flex-col justify-center items-center px-4 pb-4'>{header}</div>
        )}

        {items.map((item) => (
          <DropdownMenuItem
            key={item.label}
            className={`px-2 py-2 cursor-pointer w-full min-w-[220px] rounded-[8px]`}
            onSelect={() => {
              setIsOpen(false)
              if (item.onClick) {
                item.onClick()
              }
            }}>
            {item.to ? (
              <Link
                href={item.to}
                className='flex items-center w-full text-sm cursor-pointer'
                onClick={() => {
                  setIsOpen(false)
                }}>
                {item.icon && (
                  <span className='mr-3'>
                    <item.icon size={20} />
                  </span>
                )}
                {item.label}
              </Link>
            ) : (
              <button className='flex items-center w-full text-sm cursor-pointer' type='button'>
                {item.icon && (
                  <span className='mr-3'>
                    <item.icon size={20} />
                  </span>
                )}
                {item.label}
              </button>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default BaseDropdown
