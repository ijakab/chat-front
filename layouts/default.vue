<template>
  <div class="container">
    <nuxt />
    <footer>
      <span>&copy; 2019</span>
    </footer>
  </div>
</template>

<script>
  export default {
    mounted() {
      //this.$adonisWs.connect()
      if(process.browser) {
        this.$adonisWs.on('open', () => {
          console.log('opened');
        })
      }
    }
  }
</script>
