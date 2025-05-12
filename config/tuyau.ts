import { defineConfig } from '@tuyau/core'

const tuyauConfig = defineConfig({
  openapi: {
    documentation: {
      info: { title: 'owomi', version: '1.0.0' },
    },
  },
  codegen: {
    /**
     * Filters the definitions and named routes to be generated
     */
    // definitions: {
    //   only: [/api/],
    // },
    // routes: {
    //   only: [/api/],
    // },
  },
})

export default tuyauConfig
