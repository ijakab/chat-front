<template>
  <div class="row">
    <chat-list class="col-3"></chat-list>
    <div class="col-9">kls</div>
  </div>
</template>

<script>
  import ChatList from '~/components/ChatList'

  export default {
    components: {
      ChatList
    },

    middleware: ['auth'],

    async asyncData({app}) {
      let res = await app.$socketRequestService.get('user/chats')
      console.log(res);
    }
  }
</script>
