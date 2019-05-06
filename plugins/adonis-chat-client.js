import Vue from 'vue'
import Ws from '@adonisjs/websocket-client'
import env from '~/env.js'

const socketUrl = env.env.socketUrl

const adonisWs = function (Vue) {
  if(!socketUrl) return

  let adonisWs = Ws(socketUrl, {
    path: 'gbox-ws',
    reconnection: false
  })

  Vue.prototype.$adonisWs = adonisWs

  Vue.prototype.$adonisWs.awaitClose = function () {
    return new Promise((resolve, reject) => {
      this.close()

      let checkClosed = setInterval(() => {
        if (!this.ws) {
          clearInterval(checkClosed)
          return resolve()
        }
      }, 200)
    })
  }

}

Vue.use(adonisWs)
