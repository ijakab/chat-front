<template>
  <div class="container">
    <nuxt-link to="/">nes </nuxt-link>
    <nuxt-link to="/inspire">nes drugop</nuxt-link>
    <Header></Header>
    <br>
    <nuxt v-if="displayChat" />
    <div v-if="!displayChat">
      Loading...
    </div>
    <footer>
      <span>&copy; 2019</span>
    </footer>
  </div>
</template>

<script>
  import Header from '~/components/Header'

  export default {
    components: {
      Header
    },

    computed: {
      displayChat() {
        return this.$store.state.general.isLoaded
      }
    },

    mounted() {
      //this.$adonisWs.connect()
      if(process.browser) {
        let jwt = this.$auth.$state['token.refresh']
        this.$adonisWs.withJwtToken(jwt).connect()
        this.$adonisWs.on('open', () => {
          const userChannel = this.$adonisWs.subscribe(`backOfficeUser:${this.$auth.user.id}`)
          userChannel.on('ready', () => {
            this.$adonisWs.userChannel = this.$adonisWs.getSubscription(`backOfficeUser:${this.$auth.user.id}`)

            //subscribe to all chat channels
            let promises = []
            for(let chat of this.$store.state.chats.chats) {
              promises.push(new Promise(resolve => {
                let chatChannel = this.$adonisWs.subscribe(`chat:${chat.id}`)
                chatChannel.on('ready', () => {
                  let subscription = this.$adonisWs.getSubscription(`chat:${chat.id}`)
                  subscription.on('messageCreated', data => {
                    this.$store.commit('chats/addMessageFromSocket', {
                      ...data,
                      chatId: chat.id
                    })
                  })

                  resolve()
                })
              }))
            }

            Promise.all(promises).then(() => {
              this.$store.commit('general/setReady')
            })

            //listen to server events
            this.$adonisWs.userChannel.on('chatCreated', data => {
              this.$store.commit('chats/addChat', data)
            })
          })
        })
      }
    }
  }
</script>
