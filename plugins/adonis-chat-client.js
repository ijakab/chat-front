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

  adonisWs.awaitClose = function () {
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

  adonisWs.subscribeToUser = function(id, store) {
    return new Promise(resolve => {
      const userChannel = adonisWs.subscribe(`backOfficeUser:${id}`)
      userChannel.on('ready', () => {
        adonisWs.userChannel = adonisWs.getSubscription(`backOfficeUser:${id}`)

        //listen to server events
        adonisWs.userChannel.on('chatCreated', data => {
          store.commit('chats/addChat', data)
        })
  
        adonisWs.userChannel.on('messageCreated', data => {
          store.commit('chats/putToTop', data.chat_id)
          store.commit('chats/addMessageFromSocket', data)
        })
  
        adonisWs.userChannel.on('messageCreated', data => {
          store.commit('chats/putToTop', data.chat_id)
          store.commit('chats/addMessageFromSocket', data)
        })
  
        store.commit('general/setReady')
        resolve()
      })
    })
  }
  
}

Vue.use(adonisWs)
