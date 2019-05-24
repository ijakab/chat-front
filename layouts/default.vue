<template>
  <div class="container">
    <nuxt-link to="/">nes </nuxt-link>
    <nuxt-link to="/inspire">nes drugop</nuxt-link>
    <Header v-if="displayChat"></Header>
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
          this.$adonisWs.subscribeToUser(this.$auth.user.id, this.$store)
        })
      }
    },
  }
</script>
