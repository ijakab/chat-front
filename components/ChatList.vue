<template>
  <div>
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Add new</button>
    <create-chat></create-chat>

    <ul class="list-group">
      <nuxt-link v-for="chat in chats" :key="chat.id" v-bind:to="'/chats/'+chat.id">
        <button type="button" class="list-group-item d-flex justify-content-between align-items-center" v-bind:class="{active: activeChatId === chat.id}" style="width: 100%">
          <img v-for="profilePic in chat.profilePics" :src="profilePic" :alt="chat.displayName" :title="chat.displayName" width="20" height="20">
          {{chat.displayName}}
          <span class="badge badge-primary badge-pill" v-if="chat.me.unread">{{chat.me.unread}}</span>
        </button>
      </nuxt-link>
    </ul>

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
      chats() {
        return this.$store.state.chats.chats
      }
    }
  }
</script>
