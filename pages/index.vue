<template>
  <div class="row">
    <chat-list class="col-3"></chat-list>
    <div class="col-9">kls</div>
  </div>
</template>

<script>
  import ChatList from '~/components/ChatList'

  export default {
    components: {
      ChatList
    },

    middleware: ['auth'],

    mounted() {
      console.log(this.$store.state);
    },

    async asyncData({app}) {
      await app.store.dispatch('chats/getMyChats')
    }
  }
</script>
