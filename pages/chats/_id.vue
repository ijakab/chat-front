<template>
  <div class="row">
    <chat-list class="col-3" v-bind:activeChatId="chatId"></chat-list>

    <div class="col-9">
      <div v-for="(message, index) in chat.messages" :key="message.id">
        <div v-if="message.type === 'standard'">
          <div v-if="!chat.messages[index-1] || !chat.messages[index-1].user_id || chat.messages[index-1].user_id !== message.user_id ">
            <img :src="(chat.users[message.user_id] || chat.me).thumbnail" width="30" height="30"/>
            <span>{{(chat.users[message.user_id] || chat.me).displayName}}</span>
          </div>
          <p>{{message.body}}</p>
        </div>
        <div v-if="message.type === 'system'">
          <i>{{message.body}}</i>
        </div>
      </div>
      <br><br>
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

    computed: {
      chat() {
        return this.$store.state.chats.chats.find(chat => chat.id === this.chatId)
      },
    },

    methods: {
      sendMessage() {
        this.channel.emit('message', {
          chatId: this.chatId,
          body: this.currentMessage
        })
        this.currentMessage = ''
      }
    },

    mounted() {
      if(process.browser) {
        this.channel = this.$adonisWs.userChannel
        this.channel.emit('seen', {
          chatId: this.chatId
        })
        this.$store.commit('chats/seenChat', this.chatId)
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
