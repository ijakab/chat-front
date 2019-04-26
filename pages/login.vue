<template>
  <form v-on:submit.prevent="login()">
    <div class="form-group">
      <label for="exampleInputEmail1">Email address</label>
      <input type="text" v-model="username" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
             placeholder="Enter email">
      <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
    </div>
    <div class="form-group">
      <label for="exampleInputPassword1">Password</label>
      <input type="password" v-model="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
    </div>
    <div class="form-group form-check">
      <input type="checkbox" class="form-check-input" id="exampleCheck1">
      <label class="form-check-label" for="exampleCheck1">Check me out</label>
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
</template>

<script>
  import Toast from '@/plugins/Toast'
  import env from '~/env'

  export default {

    layout: 'anonymous',

    data() {
      return {
        username: '',
        password: ''
      }
    },

    methods: {
      async login() {
        try {
          await this.$auth.loginWith('refresh', {
            data: {
              username: this.username,
              password: this.password,
              subdomain: env.env.subdomain,
            }
          });

        } catch (e) {
          if (e.response && e.response.data) {
            Toast.fire({
              type: 'error',
              title: e.response.data.message
            })
          }
        }
      }

    }
  }

</script>
