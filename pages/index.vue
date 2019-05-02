<template>
  <div>
    <chat-list></chat-list>
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
