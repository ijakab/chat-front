import jwtDecode from 'jwt-decode'

export default class RefreshScheme {
  constructor (auth, options) {
    this.$auth = auth
    this.name = options._name
    this.options = Object.assign({}, DEFAULTS, options)
  }

  _setToken (token) {
    if (this.options.globalToken) {
      // Set Authorization token for all axios requests
      this.$auth.ctx.app.$axios.setHeader(this.options.tokenName, token)
    }
  }

  _clearToken () {
    if (this.options.globalToken) {
      // Clear Authorization token for all axios requests
      this.$auth.ctx.app.$axios.setHeader(this.options.tokenName, false)
    }
  }

  mounted () {
    if (this.options.tokenRequired) {
      const token = this.$auth.syncToken(this.name)
      this._setToken(token)
      this.$auth.syncRefreshToken(this.name)
    }

    this.watchTokenExpiration()

    return this.$auth.fetchUserOnce()
  }

  async login (endpoint) {
    let defaults = this.options.endpoints.login

    if (!defaults) return

    // Ditch any leftover local tokens before attempting to log in
    await this._logoutLocally()
    const _endpoint =
      typeof defaults === 'object'
        ? Object.assign({}, defaults, endpoint)
        : endpoint

    let data = (await this.$auth.ctx.app.$axios.request(_endpoint)).data.data

    let {accessToken, refreshToken} = data.tokens
    await this.$auth.setToken(this.name, accessToken)
    await this.$auth.setRefreshToken(this.name, refreshToken)

    this._setToken(accessToken)

    this.$auth.setUser(data.user)
  }

  async fetchUser (endpoint) {
    // User endpoint is disabled.
    if (!this.options.endpoints.user) {
      this.$auth.setUser({})
      return
    }

    // Token is required but not available
    if (this.options.tokenRequired && !this.$auth.getToken(this.name)) {
      return
    }

    // Try to fetch user and then set
    const user = await this.$auth.requestWith(
      this.name,
      endpoint,
      this.options.endpoints.user
    )

    this.$auth.setUser(user)
  }

  async logout (endpoint) {
    // Only connect to logout endpoint if it's configured
    if (this.options.endpoints.logout) {
      await this.$auth
        .requestWith(this.name, endpoint, this.options.endpoints.logout)
        .catch(() => {
        })
    }

    // But logout locally regardless
    return this._logoutLocally()
  }


  async _logoutLocally () {
    if (this.options.tokenRequired) {
      this._clearToken()
    }

    return this.$auth.reset()
  }

  watchTokenExpiration () {
    const {$axios} = this.$auth.ctx.app
    let isRefreshing = false

    $axios.onRequest(async (config) => {
      try {
        let token = this.$auth.getToken(this.name)
        let refreshToken = this.$auth.getRefreshToken(this.name)

        // token or refreshToken does not exists
        if (!token || !token.length) {
          return config
        }

        // if trying to refresh token, do not try again
        if (!isRefreshing) {
          const token_expires_at = jwtDecode(token).exp * 1000
          const now = Date.now()

          // token has expired
          if (now > token_expires_at) {

            // try refresh token
            isRefreshing = true

            let {url, method, propertyName} = this.options.endpoints.refresh

            this._clearToken()

            this.$auth.ctx.app.$axios.setHeader('refreshToken', refreshToken)

            let {data} = await $axios[method](url)

            console.log(data, 'aaaaaa')

            token = data[propertyName].tokens.accessToken

            refreshToken = data[propertyName].tokens.refreshToken

            this.$auth.setToken(this.name, token)
            this.$auth.setRefreshToken(this.name, refreshToken)
            this._setToken(token)

            config.headers[this.options.tokenName] = token

            isRefreshing = false
          }
        }
      } catch (e) {
        await this.logout()
        console.log(e.message)
      }

      return config
    })
  }
}

const DEFAULTS = {
  tokenRequired: true,
  tokenType: 'Bearer',
  globalToken: true,
  tokenName: 'accessToken'
}
