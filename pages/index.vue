<template>
  <div>
    Ovo je chat
  </div>
</template>

<script>
  export default {
    middleware: ['auth'],

    async asyncData({app}) {
      let res = await app.$socketRequestService.get('user/chats')
      console.log(res);
    }
  }
</script>
