<template>
  <div>
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Add new</button>
    <create-chat></create-chat>

    <ul class="list-group">
      <nuxt-link v-for="chat in chats" :key="chat.id" v-bind:to="'/chats/'+chat.id" >
        <button type="button" class="list-group-item d-flex justify-content-between align-items-center">
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

    computed: {
      chats() {
        return this.$store.state.chats.chats
      }
    }
  }
</script>
