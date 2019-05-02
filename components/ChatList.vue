<template>
  <div>
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Add new</button>
    <create-chat></create-chat>
  </div>
</template>

<script>
  import CreateChat from '~/components/Modals/CreateChat'

  export default {
    components: {
      CreateChat
    }
  }
</script>
