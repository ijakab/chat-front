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
          adonisWs.subscribeToChat(data.id, store)
          store.commit('chats/addChat', data)
        })

        //subscribe to all chat channels
        let promises = store.state.chats.chats.map(chat => adonisWs.subscribeToChat(chat.id, store))
        Promise.all(promises).then(() => {
          store.commit('general/setReady')
          resolve()
        })
      })
    })
  }

  adonisWs.subscribeToChat = function (id, store) {
    return new Promise(resolve => {
      let chatChannel = adonisWs.subscribe(`chat:${id}`)
      chatChannel.on('ready', () => {
        let subscription = adonisWs.getSubscription(`chat:${id}`)
        subscription.on('messageCreated', data => {
          store.commit('chats/putToTop', id)
          store.commit('chats/addMessageFromSocket', {
            ...data,
            chatId: id
          })
        })
        resolve()
      })
    })
  }

}

Vue.use(adonisWs)
