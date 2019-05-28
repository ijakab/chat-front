<template>
  <header>
    <div>{{user.displayName}}<button class="btn btn-danger btn-sm" v-on:click="logout()">Logout</button></div>

    <select v-if="canChangeStatus" @change="changeStatus($event)">
      <option v-for="availableStatus in Object.keys(statuses)" :value="availableStatus" :selected="myStatus === availableStatus">{{availableStatus}}</option>
    </select>

  </header>
</template>

<script>
  export default {

    computed: {
      user() {
        return this.$auth.$state.user.details
      },
      canChangeStatus() {
        return this.$store.state.chats.chats.length
      },
      statuses() {
        return this.$store.state.general.meta.statuses
      },
      myStatus() {
        return this.$store.state.chats.chats.length ? this.$store.state.chats.chats[0].me.chatStatus : 'online'
      }
    },

    methods: {
      changeStatus(event) {
        this.channel.emit('setChatStatus', event.target.value)
        this.$store.commit('chats/setMyStatus', event.target.value)
      },
      async logout() {
        await this.$auth.logout()
        window.location.reload()
      }
    },

    mounted() {
      let firstChat = this.$store.state.chats.chats[0]
      this.status = firstChat && firstChat.me.status
      if(process.browser) {
        this.channel = this.$adonisWs.userChannel
      }
    },
  }
</script>
