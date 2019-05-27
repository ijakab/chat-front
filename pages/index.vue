<template>
  <div class="inbox_msg">
    <chat-list></chat-list>
    <div></div>
  </div>
</template>

<script>
  import ChatList from '~/components/ChatList'

  export default {
    components: {
      ChatList
    },

    middleware: ['auth'],

    async asyncData({app}) {
      await app.store.dispatch('chats/getMyChats')
    }
  }
</script>
