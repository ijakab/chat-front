<template>
  <div class="inbox_msg">
    <update-chat :chat="chat"></update-chat>
    <chat-list v-bind:activeChatId="chatId"></chat-list>
    <div class="mesgs">
      <div class="chat-header clearfix">
        <h4 class="chat-title float-left">{{chat.displayName}}</h4>
        <p class="info-btn float-right" data-toggle="modal" data-target="#updateChatModal" v-if="chat.me.admin">ⓘ</p>
        <p class="info-btn float-right">⇠</p>
      </div>
      <message-list :chatId="chatId"></message-list>
      <add-message :chatId="chatId"></add-message>
    </div>
  </div>
</template>

<script>
  import ChatList from '~/components/ChatList'
  import AddMessage from '~/components/AddMessage'
  import MessageList from '~/components/MessageList'
  import UpdateChat from '~/components/Modals/UpdateChat'

  export default {
    components: {
      ChatList,
      AddMessage,
      MessageList,
      UpdateChat
    },

    middleware: ['auth'],

    computed: {
      chat() {
        return this.$store.state.chats.chats.find(chat => chat.id === this.chatId)
      },
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
