// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/main.css'],

  runtimeConfig: {
    public: {
      // Read from NUXT_PUBLIC_STRAPI_URL env var in production
      strapiUrl: process.env.NUXT_PUBLIC_STRAPI_URL || 'http://localhost:1337',
    },
  },

  pages: true,

  // Enables auto-imports for Vue composables
  imports: {
    autoImport: true,
  },
})
