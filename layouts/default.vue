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
    async mounted() {
      await new Promise(resolve => {
        setTimeout(function () {
          console.log('plugin 2');
          resolve()
        }, 2000)
      })
    }
  }
</script>
