<template>
  <div class="row">
    <chat-list class="col-3" v-bind:activeChatId="chatId"></chat-list>
    <div class="col-9">id je {{chatId}}</div>
  </div>
</template>

<script>
  import ChatList from '~/components/ChatList'

  export default {
    components: {
      ChatList
    },

    async asyncData({params, app}) {
      await app.store.dispatch('chats/getMyChats')
      return {
        chatId: Number(params.id)
      }
    }
  }
</script>
