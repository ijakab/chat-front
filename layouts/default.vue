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
        this.$adonisWs.connect()
        this.$adonisWs.on('open', () => {
          this.$store.commit('general/setReady')
        })
      }
    }
  }
</script>
