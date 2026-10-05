// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  experimental: {
    appManifest: false,
  },

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@hebilicious/vue-query-nuxt',
  ],

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'system',
    fallback: 'dark',
  },

  runtimeConfig: {
    aiBaseUrl: process.env.AI_BASE_URL || 'https://openrouter.ai/api/v1',
    aiApiKey: process.env.AI_API_KEY || '',
    aiModelName: process.env.AI_MODEL_NAME || 'deepseek/deepseek-chat',
    public: {
      appName: 'Tử Vi AI',
    },
  },

  app: {
    head: {
      title: 'Tử Vi AI - Cố Vấn Cuộc Sống & Luận Giải Tử Vi Đẩu Số',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
        { name: 'description', content: 'Ứng dụng xem lá số Tử Vi Đẩu Số tức thì và luận giải chuyên sâu bằng AI theo phong cách Apple Minimalist, tối ưu trên di động.' },
        { name: 'theme-color', content: '#090d16' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap' },
      ],
    },
  },
})
