<template>
  <header>
    {{user.displayName}}<button class="btn btn-danger btn-sm" v-on:click="logout()">Logout</button>
  </header>
</template>

<script>
  export default {
    computed: {
      user() {
        return this.$auth.state.user.details
      }
    },

    methods: {
      async logout() {
        await this.$auth.logout()
        window.location.reload()
      }
    }
  }
</script>
