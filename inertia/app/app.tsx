/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import { createInertiaApp } from '@inertiajs/react'
import { hydrateRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import DashboardLayout from '~/components/layouts/dashboard-layout'
import MarketingLayout from '~/components/layouts/marketing-layout'
import type React from 'react'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

type PageComponent = { default: { layout?: (p: React.ReactNode) => React.JSX.Element } }

createInertiaApp({
  progress: { color: '#00867F', showSpinner: true },

  title: (title) => `${title} - ${appName}`,

  resolve: async (name) => {
    const page = (await resolvePageComponent(
      `../pages/${name}.tsx`,
      import.meta.glob('../pages/**/*.tsx'),
    )) as PageComponent

    if (name.includes('dashboard')) {
      page.default.layout ??= (p) => <DashboardLayout children={p} />
    } else {
      page.default.layout ??= (p) => <MarketingLayout children={p} />
    }

    return page
  },

  setup({ el, App, props }) {
    hydrateRoot(
      el,
      <>
        <App {...props} />
        <Toaster
          position='top-right'
          className='h-10'
          style={{ fontFamily: 'system-ui' }}
          toastOptions={{ className: 'p-4' }}
        />
      </>,
    )
  },
})
