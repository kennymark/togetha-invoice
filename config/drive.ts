import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig, services } from '@adonisjs/drive'

const driveConfig = defineConfig({
  default: env.get('DRIVE_DISK'),

  /**
   * The services object can be used to configure multiple file system
   * services each using the same or a different driver.
   */
  services: {
    fs: services.fs({
      location: app.makePath('storage'),
      serveFiles: true,
      routeBasePath: '/uploads',
      visibility: 'public',
    }),

    r2: services.s3({
      credentials: {
        accessKeyId: env.get('R2_ACCESS_KEY_ID'),
        secretAccessKey: env.get('R2_SECRET_ACCESS_KEY'),
      },
      region: env.get('R2_REGION'),
      bucket: env.get('R2_BUCKET'),
      endpoint: env.get('R2_ENDPOINT'),
      // Ensure the cdnUrl is correctly set by directly using the endpoint if the public access URL is not working
      cdnUrl: env.get('R2_PUBLIC_ACCESS_URL') || env.get('R2_ENDPOINT'),

      visibility: 'public',
    }),
  },
})

export default driveConfig

declare module '@adonisjs/drive/types' {
  export interface DriveDisks extends InferDriveDisks<typeof driveConfig> {}
}
