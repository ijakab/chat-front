<template>
  <header>
    <div>{{user.displayName}}<button class="btn btn-danger btn-sm" v-on:click="logout()">Logout</button></div>

    <select v-if="canChangeStatus" v-model="status" @change="changeStatus">
      <option v-for="availableStatus in Object.keys(statuses)" :value="availableStatus" >{{availableStatus}}</option>
    </select>

  </header>
</template>

<script>
  export default {
    data: () => {
      return {
        status: ''
      }
    },

    computed: {
      user() {
        return this.$auth.state.user.details
      },
      canChangeStatus() {
        return this.$store.state.chats.chats.length
      },
      statuses() {
        return this.$store.state.general.meta.statuses
      },
    },

    methods: {
      changeStatus() {
        console.log('hocu', this.status)
      },
      async logout() {
        await this.$auth.logout()
        window.location.reload()
      }
    },

    mounted() {
      let firstChat = this.$store.state.chats.chats[0]
      this.status = firstChat && firstChat.me.status
    },
  }
</script>
