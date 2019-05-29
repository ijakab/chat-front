<template>
  <div class="type_msg">
    <div class="input_msg_write">
      <form v-on:submit.prevent="sendMessage">
        <input type="text" v-model="currentMessage" class="write_msg" id="exampleInputEmail1" placeholder="Text something here" @keydown="startTyping" @keyup="stopTyping" />
        <button class="msg_send_btn" type="button" @click="sendMessage">➤</button>
      </form>
    </div>
  </div>
</template>

<script>
  import debounce from 'lodash/debounce'

  export default {
    data: () => {
      return {
        currentMessage: '',
        typing: false
      }
    },

    props: ['chatId'],

    methods: {
      sendMessage() {
        this.channel.emit('message', {
          chatId: this.chatId,
          body: this.currentMessage
        })
        this.currentMessage = ''
        this.$nuxt.$emit('scrollDownAuto')
      },
      startTyping() {
        if (this.typing) return
        this.typing = true
        this.channel.emit('typing', {
          chatId: this.chatId,
          isTyping: true
        })
      },
      stopTyping: debounce(function () {
        this.typing = false
        this.channel.emit('typing', {
          chatId: this.chatId,
          isTyping: false
        })
      }, 2000),
    },

    mounted() {
      this.channel = this.$adonisWs.userChannel
    }

  }
</script>
