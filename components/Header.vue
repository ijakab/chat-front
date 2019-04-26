<template>
  <header>
    <button class="btn btn-danger btn-sm" v-on:click="logout()">Logout</button>
  </header>
</template>

<script>
  export default {
    methods: {
      async logout() {
        await this.$auth.logout()
        window.location.reload()
      }
    }
  }
</script>
