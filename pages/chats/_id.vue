<template>
  <div class="inbox_msg">
    <chat-list v-bind:activeChatId="chatId"></chat-list>
    <div class="mesgs">
      <message-list :chatId="chatId"></message-list>
      <add-message :chatId="chatId"></add-message>
    </div>
  </div>
</template>

<script>
  import ChatList from '~/components/ChatList'
  import AddMessage from '~/components/AddMessage'
  import MessageList from '~/components/MessageList'

  export default {
    components: {
      ChatList,
      AddMessage,
      MessageList
    },

    mounted() {
      if(process.browser) {
        this.subscription = this.$adonisWs.subscribe(`chat:${this.chatId}`)
        this.channel = this.$adonisWs.userChannel
        this.channel.emit('seen', {
          chatId: this.chatId
        })
        this.$store.commit('chats/seenChat', this.chatId)
        this.$store.commit('chats/setActiveChat', this.chatId)
      }
    },

    destroyed() {
      this.subscription.close()
    },

    async asyncData({params, store}) {
      let chatId = Number(params.id)
      await store.dispatch('chats/getMyChats')
      await store.dispatch('chats/getChatMessages', chatId)
      return {
        chatId,
      }
    }
  }
</script>
