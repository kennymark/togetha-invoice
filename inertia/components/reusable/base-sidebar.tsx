// src/components/reusable/collapsible-sidebar.tsx
'use client'

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
  SidebarInset,
} from '~/components/ui/sidebar'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link, usePage } from '@inertiajs/react'
import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '~/lib/utils'
import React from 'react'

export interface SidebarRoute {
  label: string
  href: string
  icon: LucideIcon
}

interface CollapsibleSidebarProps {
  routes: SidebarRoute[]
  logo: ReactNode
  collapsedLogo?: ReactNode
  children: ReactNode
  footer?: ReactNode
}

export default function CollapsibleSidebar({
  routes,
  logo,
  collapsedLogo,
  footer,
  children,
}: CollapsibleSidebarProps) {
  return (
    <SidebarProvider>
      <SidebarBody routes={routes} logo={logo} collapsedLogo={collapsedLogo} footer={footer} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}

const SidebarBody = React.memo(
  ({
    routes,
    logo,
    collapsedLogo,
    footer,
  }: {
    routes: SidebarRoute[]
    logo: ReactNode
    collapsedLogo?: ReactNode
    footer?: ReactNode
  }) => {
    const { open, toggleSidebar } = useSidebar()
    const location = usePage().url.split(/[?#]/)[0]
    console.log('page location url', location)

    // Memoize the isRouteActive function
    const isRouteActive = React.useCallback(
      (href: string): boolean => {
        if (href === '/dashboard') {
          return location === href
        }
        return location === href || location.startsWith(`${href}/`)
      },
      [location],
    )

    // Memoize the routes rendering
    const renderedRoutes = React.useMemo(() => {
      return routes.map((route) => {
        const isActive = isRouteActive(route.href)
        return (
          <SidebarMenuItem
            key={route.href}
            data-active={isActive}
            className={cn(!open && 'w-full flex justify-center')}>
            <SidebarMenuButton asChild>
              <Link
                href={route.href}
                onClick={(e) => {
                  if (location === route.href) {
                    e.preventDefault()
                    return
                  }
                }}
                className={cn(
                  'flex items-center gap-2 rounded-[12px] transition-all duration-300 ease-in-out ',
                  isActive
                    ? 'bg-muted text-white hover:text-white'
                    : 'text-[#FFFFFF80] hover:text-white',
                  open ? 'px-4 py-3' : 'p-2',
                )}>
                <route.icon className='shrink-0' size={20} />
                <span className='truncate'>{route.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })
    }, [routes, isRouteActive, open, location])

    return (
      <Sidebar
        collapsible='icon'
        className='relative border-r min-h-screen h-full bg-primary w-[240px] transition-all duration-300 ease-in-out'>
        <SidebarHeader>
          <div className='flex items-center justify-between px-4 py-4'>
            <span className='flex items-center justify-center w-full gap-2 transition-all duration-300 ease-in-out'>
              {open ? logo : collapsedLogo}
            </span>
            <button
              aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
              onClick={toggleSidebar}
              className='rounded-[12px] p-1 bg-accent hover:bg-accent/95 transition-all duration-300 ease-in-out absolute -right-3 top-[80px] shadow'
              style={{ zIndex: 10 }}
              type='button'>
              {open ? (
                <ChevronLeft size={20} className='text-white' />
              ) : (
                <ChevronRight size={20} className='text-white' />
              )}
            </button>
          </div>
        </SidebarHeader>
        <SidebarContent className='mt-12'>
          <SidebarMenu
            className={cn(open ? 'px-8' : 'px-1', 'transition-all duration-300 ease-in-out')}>
            {renderedRoutes}
          </SidebarMenu>
        </SidebarContent>

        {footer && (
          <SidebarFooter className='mt-auto flex flex-col items-center gap-2 p-4'>
            {footer}
          </SidebarFooter>
        )}
      </Sidebar>
    )
  },
)

SidebarBody.displayName = 'SidebarBody'
