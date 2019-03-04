const pkg = require('./package')


const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/style/app.styl'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vuetify'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  auth: {
    defaultStrategy: 'refresh',
    strategies: {
      refresh: {
        _scheme: '~/auth/schemes/refresh.js',
        endpoints: {
          login: {
            url: env.apiBaseUrl + '/api/v1/login',
            method: 'post',
            propertyName: 'data.tokens.accessToken'
          },
          logout: false,
          user: {
            url: env.apiBaseUrl + '/api/v1/user/profile',
            method: 'get',
            propertyName: 'data'
          },
          refresh: {
            url: env.apiBaseUrl + '/api/v1/refresh',
            method: 'get',
            propertyName: 'data'
          }
        },
      }
    },
    redirect: {
      login: '/adminLogin',
      logout: false,
      home: '/'
    },
    cookie: {
      name: 'token',
      options: {
        path: '/',
        domain: env.cookieDomain
      }
    },
    token: {
      prefix: 'token.'
    },
    refresh_token: {
      prefix: 'refresh_token.'
    },
    localStorage: false
  },


  /*
  ** Build configuration
  */
  build: {
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ["~assets/style/variables.styl"]
      }
    },
    
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      
    }
  }
}
