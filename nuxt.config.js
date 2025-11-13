import { join } from 'path'
import { getRoutes } from './services/routes.service'

const routeToExclude = [
  '/',
  '/search',
  '/company/our-values',
  '/company/story',
  '/contacts',
  '/cookie-policy',
  '/privacy-policies',
  '/terms-and-conditions',
  '/cookie',
  '/discover/products',
  '/discover/prodotti',
  '/discover/ricette',
  '/discover/recipes',
  '/products',
  '/products/lines',
  '/products/origins',
  '/products/agings',
  '/recipes',
  '/recipes/recipes-wizard',
  '/recipes/recipes-wizard/results',
]

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  env: {
    baseUrl: process.env.URL,
  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'pinna-formaggi',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'msapplication-TileColor', content: '#ffffff' },
      { name: 'msapplication-TileImage', content: '/ms-icon-144x144.png' },
      {
        name: 'facebook-domain-verification',
        content: 'geegx69phgqwf75qda99yg5v5a7tnr',
      },
    ],
    link: [
      { rel: 'manifest', href: '/manifest.json' },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '96x96',
        href: '/favicon-96x96.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        href: '/android-icon-192x192.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-icon-180x180.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '152x152',
        href: '/apple-icon-152x152.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '144x144',
        href: '/apple-icon-144x144.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '120x120',
        href: '/apple-icon-120x120.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '114x114',
        href: '/apple-icon-114x114.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '76x76',
        href: '/apple-icon-76x76.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '72x72',
        href: '/apple-icon-72x72.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '60x60',
        href: '/apple-icon-60x60.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '57x57',
        href: '/apple-icon-57x57.png',
      },
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '~/assets/styles/fonts.css',
    '~/assets/styles/buttons.css',
    '~/assets/styles/banner.css',
    '~/assets/styles/markdown.css',
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/vue-sanitize.js',
    '~/plugins/vue-markdown-it.js',
    '~/plugins/vue-infinite-loading.js',
    '~/plugins/vue-datocms.js',
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/svg',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://i18n.nuxtjs.org/
    'nuxt-i18n',
    '@nuxtjs/gtm',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '~/modules/generateRedirects',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: '/',
  },

  // i18n module configuration
  i18n: {
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        file: 'en.js',
      },
      {
        code: 'it',
        iso: 'it-IT',
        file: 'it.js',
      },
    ],
    defaultLocale: 'en',
    langDir: 'locales/',
    lazy: true,
    baseUrl: process.env.URL,
    strategy: 'prefix',
    seo: false, // Managed in default layout
    detectBrowserLanguage: false,
    vueI18n: {
      fallbackLocale: 'en',
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    postcss: {
      plugins: {
        tailwindcss: join(__dirname, 'tailwind.config.js'),
        'postcss-nested': {},
        autoprefixer: {},
      },
    },
    extend(config) {
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      })
    },
  },
  loading: {
    color: '#82A44B',
    height: '3px',
  },
  gtm: {
    id: 'GTM-PM3TS29',
    scriptDefer: true,
  },
  generate: {
    crawler: false,
    interval: 500,
    exclude: routeToExclude,
    routes: getRoutes,
  },
  sitemap: {
    hostname: process.env.URL,
    gzip: true,
    exclude: routeToExclude,
    filter({ routes }) {
      return routes.map((route) => {
        if (route.url.slice(-1) !== '/') {
          route.url = `${route.url}/`
        }
        return route
      })
    },
  },
  robots: {
    Sitemap: process.env.URL + '/sitemap.xml',
    UserAgent: '*',
    Allow: '/',
    Disallow: ['*/?', '*/?*'],
  },
}
