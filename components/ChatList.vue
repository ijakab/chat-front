<template>
  <div>
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Add new</button>
    <create-chat></create-chat>
    <ul class="list-group">
      <button type="button" class="list-group-item d-flex justify-content-between align-items-center" v-for="chat in chats">
        {{chat.title}}
        <span class="badge badge-primary badge-pill">14</span>
      </button>
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
