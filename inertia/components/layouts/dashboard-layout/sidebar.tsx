import { Link } from '@inertiajs/react'
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  CreditCard,
  BarChart2,
  Settings,
} from 'lucide-react'
import type { SidebarRoute } from '~/components/reusable/base-sidebar'
import CollapsibleSidebar from '~/components/reusable/base-sidebar'
import { getRoutePath } from '~/config/get-route-path'

const dashboardRoutes: SidebarRoute[] = [
  {
    label: 'Dashboard',
    href: getRoutePath('dashboard'),
    icon: LayoutDashboard,
  },
  {
    label: 'Invoices',
    href: getRoutePath('dashboard_invoices'),
    icon: FileText,
  },
  {
    label: 'Payments',
    href: getRoutePath('dashboard_payments'),
    icon: CreditCard,
  },
  {
    label: 'Jobs',
    href: getRoutePath('dashboard_jobs'),
    icon: Briefcase,
  },
  {
    label: 'Customers',
    href: getRoutePath('dashboard_customers'),
    icon: Users,
  },
  {
    label: 'Finance',
    href: getRoutePath('dashboard_finance'),
    icon: BarChart2,
  },
  {
    label: 'Settings',
    href: getRoutePath('dashboard_settings'),
    icon: Settings,
  },
]

export default function DashboardSidebar({ children }: { children: React.ReactNode }) {
  return (
    <CollapsibleSidebar
      routes={dashboardRoutes}
      logo={
        <Link href={'/'}>
          <span className='text-xl font-bold text-white text-center'>Togetha</span>
        </Link>
      }
      collapsedLogo={<span className='text-xl font-bold text-white text-center'>T</span>}>
      {children}
    </CollapsibleSidebar>
  )
}
