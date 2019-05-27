<template>
  <div class="inbox_msg">
    <chat-list v-bind:activeChatId="chatId"></chat-list>

    <div class="mesgs">
      <div class="msg_history">

        <div v-for="(message, index) in chat.messages" :key="message.id" :class="{incoming_msg: !isMine(message), outgoing_msg: isMine(message)}" >

          <div v-if="!isMine(message) && message.type === 'standard'">
            <div v-if="!chat.messages[index-1] || !chat.messages[index-1].user_id || chat.messages[index-1].user_id !== message.user_id" class="incoming_msg_img">
              <img :src="(chat.users[message.user_id] || chat.me).thumbnail"/>
            </div>
          </div>

          <div :class="{received_msg: !isMine(message), sent_msg: isMine(message)}">
          <div v-if="message.type === 'standard'">
            <div :class="{received_withd_msg: !isMine(message)} ">
              <p>{{message.body}}</p>
              <span class="time_date">{{messageTime(message)}}</span> </div>
            </div>
          </div>

          <div v-if="message.type === 'system'" class="text-center">
            <i>{{message.body}}</i>
          </div>

        </div>

          <div v-if="userArray.length < 10">
            {{seenBy}}
          </div>

        </div>

        <div class="type_msg">
          <div class="input_msg_write">
            <form v-on:submit.prevent="sendMessage">
                <input type="text" v-model="currentMessage" class="write_msg" id="exampleInputEmail1" placeholder="Text something here" />
                <button class="msg_send_btn" type="button">➤</button>
            </form>
          </div>
        </div>

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
      userArray() {
        return Object.values(this.chat.users)
      },
      isMine() {
        return message => {
          return this.chat.me.id === message.user_id
        }
      },
      seenBy() {
        let chat = this.chat
        let seenArr = this.chat.seenBy

        if(!seenArr.length) return ''
        if(seenArr.length === this.userArray.length) return 'Seen'
        return 'Seen by ' + seenArr.map(id => chat.users[id].firstName).join(', ')
      },
      messageTime() {
        return message => {
          let date = new Date(message.updated_at)
          return date.toLocaleTimeString('hr-HR')
        }
      }
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
        chatId
      }
    }
  }
</script>
