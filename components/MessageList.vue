<template>
  <div class="msg_history" ref="messages">
    <no-ssr>
      <infinite-loading
        :distance="0"
        direction="top"
        @infinite="loadMore"
      >
        <div slot="no-more"></div>
        <div slot="no-results"></div>
      </infinite-loading>
    </no-ssr>

    <div v-for="(message, index) in chat.messages" :key="message.id" :class="{incoming_msg: !isMine(message), outgoing_msg: isMine(message)}" >

      <div v-if="!isMine(message) && message.type === 'standard'">
        <div v-if="!chat.messages[index-1] || !chat.messages[index-1].user_id || chat.messages[index-1].user_id !== message.user_id" class="incoming_msg_img">
          <img :src="(chat.users[message.user_id] || chat.me).thumbnail"/>
        </div>
      </div>

      <div :class="{received_msg: !isMine(message), sent_msg: isMine(message)}">
        <div v-if="message.type === 'standard'">
          <div :class="{received_withd_msg: !isMine(message)} ">

            <div class="msg_actions" v-if="isMine(message)">
              <span v-on:click="deleteMessage(message)">X</span>
              <span>Y</span>
            </div>

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
    <div>
      {{currentlyTypingText}}
    </div>

  </div>

</template>

<script>
  import InfiniteLoading from 'vue-infinite-loading';

  export default {
    components: {
      InfiniteLoading,
    },

    props: ['chatId'],

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
      },
      currentlyTypingText() {
        let typing = this.chat.currentlyTyping
        if(!typing.length) return ''
        if(typing.length === 1) return this.chat.users[typing[0]].firstName + ' is typing'
        let names = typing.map(id => this.chat.users[id].firstName)
        return names.join(', ') + 'are typing'
      }
    },

    methods: {
      async loadMore($state) {
        let allLoaded = await this.$store.dispatch('chats/loadMore', this.chat)
        $state.loaded()
        if(allLoaded) $state.complete()
      },
      scrollToBottom() {
        this.$nextTick(() => {
          this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight
        })
      },
      deleteMessage(message) {
        this.channel.emit('deleteMessage', message.id)
      }
    },

    mounted() {
      if(process.browser) {
        this.channel = this.$adonisWs.userChannel
        this.scrollToBottom()
        this.$nuxt.$on('scrollDownAuto', () => {
          this.scrollToBottom()
        })
      }
    },
  }
</script>
