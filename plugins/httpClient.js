import env from '~/env'

class HttpClient {
  constructor(axios) {
    this.axios = axios
    this.terminatingMethods()
    this._headers = {}
  }

  jwt(jwt) {
    this._jwt = jwt
    return this
  }
  noJwt() {
    this._jwt = null
    return this
  }
  withLog() {
    this._log = true
    return this
  }

  body(body) {this._body = body; return this}
  headers(headers) {
    Object.assign(this._headers, headers)
    return this
  }
  queryParams(params) {this._queryParams = params; return this}

  terminatingMethods() {
    const methods = ['get', 'post', 'put', 'patch', 'delete']
    for(let method of methods) {
      this[method] = async (url, fallback) => {
        this.url = url
        this._method = method
        return await this.excecute(false, fallback)
      }
      this[method+'OrFail'] = async (url) => {
        this.url = url
        this._method = method
        return await this.excecute(true)
      }
    }
  }

  async excecute(fail, fallback) {
    try {
      if(this._jwt) this._headers['accessToken'] = this._jwt
      let response = await this.axios({
        method: this._method,
        url: env.env.socketApiBaseUrl + this.url,
        data: this._body,
        params: this._queryParams,
        headers: this._headers
      })
      if(this._log) {
        this._log = false
        this._logRequest('log', response.data)
      }
      return response.data.data
    } catch (e) {
      this._logRequest('error', e.response && e.response.data)
      if(fail) throw e
      return fallback
    }
  }

  _logRequest(method, response) {
    console[method] (`${method} calling API!!!'
            Route: ${this._method}, ${env.env.socketApiBaseUrl + this.url}
            Query params %o'
            Payload: %o
            Headers: %o'
            Response: %o`, this._queryParams, this._body, this._headers, response)
  }
}

function getCookie(cookies, cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(cookies);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export default ({req, app}, inject) => {
  let cookies
  if (process.server) {
    if (req.headers.cookie) {
      cookies = req.headers.cookie
    }
  } else {
    if (document.cookie) {
      cookies = document.cookie
    }
  }

  let jwt = getCookie(cookies, 'auth.token.local');
  let client = new HttpClient(app.$axios)
  client.jwt(jwt)
  client.headers({
    'Content-Type': 'application/json'
  })
  inject('socketRequestService', client)
}
