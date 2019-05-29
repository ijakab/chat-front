<template>
  <div class="container">
        <div class="inbox_msg">
            <nuxt v-if="displayChat" />
        </div>
        <div v-if="!displayChat">
          Loading...
        </div>

    <footer>
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
          this.$adonisWs.subscribeToUser(this.$auth.user.id, this.$store)
        })
      }
    },
  }
</script>
