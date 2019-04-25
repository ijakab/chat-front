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
      console.log('adonisws je', this.$adonisWs);
    }
  }
</script>
