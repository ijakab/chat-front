<template>
  <div class="container">
    <Header></Header>
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
            this.$store.commit('general/setReady')

            this.$adonisWs.userChannel.on('chatCreated', data => {
              this.$store.commit('chats/addChat', data)
            })
          })
        })
      }
    }
  }
</script>
