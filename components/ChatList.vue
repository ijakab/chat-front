<template>
  <div class="inbox_people">

    <div class="headind_srch">
      <div class="recent_heading">
        <h4>{{user.displayName}}</h4>
      </div>
      <div class="srch_bar">
        <div class="stylish-input-group">
          <button class="btn btn-danger btn-sm" v-on:click="logout()">Logout</button>
          <select @change="changeStatus($event)">
            <option v-for="availableStatus in Object.keys(statuses)" :value="availableStatus" :selected="myStatus === availableStatus">{{availableStatus}}</option>
          </select>
        </div>
      </div>
    </div>

    <create-chat></create-chat>

    <div class="inbox_chat">
      <span data-toggle="modal" data-target="#exampleModal" class="new-chat-button">+</span>
      <div class="chat_list" v-for="chat in chats" :key="chat.id" v-bind:class="{active_chat: activeChatId === chat.id}" >
        <nuxt-link v-bind:to="'/chats/'+chat.id">
          <div class="chat_people">
            <div class="chat_img">
              <img :src="profilePic" :alt="chat.displayName" v-for="profilePic in chat.profilePics">
              <span class="badge badge-pill chat_status" :class="statusColor(chat)+'-status'">j</span>
            </div>
            <div class="chat_ib">
              <h5>{{chat.displayName}}
                <span class="chat_date">{{lastMessageAt(chat)}}</span>
                <br>
                <span class="badge badge-danger" v-if="chat.me.unread">{{chat.me.unread}}</span>
              </h5>
              <p>{{lastMessageDisplay(chat.lastMessage)}}.</p>
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>

  </div>
</template>

<script>
  import CreateChat from '~/components/Modals/CreateChat'

  export default {
    components: {
      CreateChat
    },

    props: ['activeChatId'],

    computed: {
      user() {
        return this.$auth.$state.user.details
      },
      statuses() {
        return this.$store.state.general.meta.statuses
      },
      myStatus() {
        return this.$store.state.chats.chats.length ? this.$store.state.chats.chats[0].me.chatStatus : 'online'
      },
      chats() {
        return this.$store.state.chats.chats
      },
      lastMessageAt() {
        return chat => {
          let date = new Date(chat.last_message_at)
          return date.toLocaleDateString('hr-HR')
        }
      },
      lastMessageDisplay() {
        return messageObject => {
          if(!messageObject || !messageObject.body) return ''
          if(messageObject.body.length < 20) return messageObject.body
          else return messageObject.body.substr(0, 18) + '...'
        }
      },
      statusColor() {
        let statuses = this.statuses
        return chat => {
          let users = Object.values(chat.users)
          if(users.length === 0) {
            return statuses[chat.me.chatStatus].color
          } else if(users.length === 1) {
            return statuses[users[0].chatStatus].color
          } else {
            let status = users[0].chatStatus
            for(let user of users) {
              if(user.chatStatus !== status) {
                console.log(user)
                return 'gray'
              }
            }
            return statuses[status].color
          }
        }
      }
    },

    methods: {
      async logout() {
        await this.$auth.logout()
        window.location.href = '/'
        window.location.reload()
      },
      changeStatus(event) {
        this.channel.emit('setChatStatus', event.target.value)
        this.$store.commit('chats/setMyStatus', event.target.value)
      },
    },

    mounted() {
      if(process.browser) {
        this.channel = this.$adonisWs.userChannel
      }
    },
  }
</script>
