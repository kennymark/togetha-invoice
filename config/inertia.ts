import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'

const inertiaConfig = defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'inertia_layout',

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    session: (ctx) => ctx.session,
    qs: (ctx) => ctx.request.qs(),
    user: (ctx) => ({
      id: ctx.auth.user?.id,
      email: ctx.auth.user?.email,
      fullName: ctx.auth.user?.fullName,
      is2FaEnabled: ctx.auth.user?.is2faEnabled,
      isActive: ctx.auth.user?.isActive,
      metadata: ctx.auth.user?.metadata,
      secondaryEmail: ctx.auth.user?.secondaryEmail,
      contactNumber: ctx.auth.user?.contactNumber,
      status: ctx.auth.user?.status,
      createdAt: ctx.auth.user?.createdAt,
      updatedAt: ctx.auth.user?.updatedAt,
    }),
  },

  /**
   * Options for the server-side rendering
   */
  ssr: {
    enabled: true,
    entrypoint: 'inertia/app/ssr.tsx',
  },
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {}
}
