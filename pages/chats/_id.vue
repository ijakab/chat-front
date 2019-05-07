<template>
  <div class="row">
    <chat-list class="col-3" v-bind:activeChatId="chatId"></chat-list>

    <div class="col-9">
      <form v-on:submit.prevent="sendMessage">
        <div class="form-group">
          <input type="text" v-model="currentMessage" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Text something here">
        </div>
      </form>
    </div>

  </div>
</template>

<script>
  import ChatList from '~/components/ChatList'

  export default {
    components: {
      ChatList
    },

    data: () => {
      return {
        currentMessage: ''
      }
    },

    methods: {
      sendMessage() {
        this.chatChannel.emit('message', this.currentMessage)
        this.currentMessage = ''
      }
    },

    mounted() {
      if(process.browser) {
        this.chatChannel = this.$adonisWs.getSubscription(`chat:${this.chatId}`)
      }
    },

    async asyncData({params, store}) {
      let chatId = Number(params.id)
      await store.dispatch('chats/getMyChats')
      await store.dispatch('chats/getChatMessages', chatId)
      return {
        chatId
      }
    }
  }
</script>
