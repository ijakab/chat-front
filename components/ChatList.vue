<template>
  <div class="inbox_people">

    <div class="headind_srch">
      <div class="recent_heading">
        <h4>Recent</h4>
      </div>
      <div class="srch_bar">
        <div class="stylish-input-group">
          <input type="text" class="search-bar"  placeholder="Search" >
          <span data-toggle="modal" data-target="#exampleModal">+</span>
        </div>
      </div>
    </div>

    <create-chat></create-chat>

    <div class="inbox_chat">
      <div class="chat_list" v-for="chat in chats" :key="chat.id" v-bind:class="{active_chat: activeChatId === chat.id}" >
        <nuxt-link v-bind:to="'/chats/'+chat.id">
          <div class="chat_people">
            <div class="chat_img" v-for="profilePic in chat.profilePics"> <img :src="profilePic" :alt="chat.displayName"> </div>
            <div class="chat_ib">
              <h5>{{chat.displayName}} <span class="chat_date">{{lastMessageAt(chat)}}</span></h5>
              <p>{{lastMessageDisplay(chat.lastMessage)}}.</p>
              <p>{{chat.me.unread}}</p>
              <span class="badge badge-pill" :class="statusColor(chat)+'-status'">j</span>
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>

  </div>
</template>

<style>
  .green-status {
    color: green;
    background: green;
  }
  .gray-status {
    color: gray;
    background: gray;
  }
  .red-status {
    color: red;
    background: red;
  }
  .yellow-status {
    color: yellow;
    background: yellow;
  }
</style>

<script>
  import CreateChat from '~/components/Modals/CreateChat'

  export default {
    components: {
      CreateChat
    },

    props: ['activeChatId'],

    computed: {
      statuses() {
        return this.$store.state.general.meta.statuses
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
    }
  }
</script>
