import Vue from 'vue'
import ws from '@adonisjs/websocket-client'
import env from '~/env.js'
const socketUrl = env.env.socketUrl

const adonisWs = function (Vue) {
  if(!socketUrl) return

  let adonisWs = ws(socketUrl, {
    path: 'gbox-ws'
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
