<template>
  <div class="premade_login">
    <div class="premade_login_box clearfix">
      <div class="premade_login--logo">
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Archlinux-icon-crystal-64.svg" alt="">
      </div>
      <form class="display_flex display_flex--alignItems-center" @submit.prevent="login">
        <div>
          <div class="premade_login_box--item">
            <label for="email" class="premade_label">Username:</label>
            <input id="email"
                   class="premade_input"
                   type="text"
                   v-model="username"
                   placeholder="Username"
                   required>
          </div>
          <div class="premade_login_box--item">
            <label for="password" class="premade_label">Password:</label>
            <input id="password"
                   v-model="password"
                   class="premade_input"
                   type="password"
                   placeholder="Password"
                   required>
          </div>
        </div>
        <div class="premade_login_box--login">
          <button type="submit" class="click click_link">Sign in</button>
        </div>
      </form>
      <div class="premade_login_box--item premade_login_box--forgotPassword">
        <a class="click click_link">Forgot your password?</a>
      </div>
    </div>
  </div>
</template>

<script>
  import Toast from '@/plugins/Toast'

  export default {

    data () {
      return {
        username: '',
        password: ''
      }
    },

    methods: {
      async login () {
        try {
          await this.$auth.loginWith('refresh', {data: {
              username: this.username,
              password: this.password,
              subdomain: process.env.subdomain,
            }});

        } catch (e) {
          if (e.response && e.response.data) {
            Toast({
              type: 'error',
              title: e.response.data.message
            })
          }

          throw e
        }
      }

    }
  }

</script>

<style lang="scss" scoped>
  @import "~assets/style/helpers/mixins";

  .premade_login {
    background-color: #373737;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .premade_login--logo {
    text-align: center;
    margin-bottom: 2rem;
    img {
      width: 10rem;
      height: auto;
      object-fit: cover;
    }
  }

  .premade_login_box {
    width: auto;
    padding: 2rem;
    color: #a8a7a8;
    font-size: 1.2rem;
    @include border-radius(5px);
  }

  .premade_login_box--item {
    margin: 2rem 0;
    &:first-child {
      margin-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }

  $btn_size: 7rem;

  .premade_login_box--login {
    margin-left: 2rem;
    button {
      background-color: #00a1d2;
      display: block;
      height: $btn_size;
      line-height: $btn_size;
      width: $btn_size;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: .5px;
      @include border-radius(5px);
      &:hover {
        background-color: lighten(#00a1d2, 20%)
      }
    }
  }

  .premade_login_box--forgotPassword {
    margin-left: 10rem;
    a {
      font-size: 1.2rem;
      color: #00a1d2;
      &:hover {
        color: lighten(#00a1d2, 20%)
      }
    }
  }

  .premade_label {
    float: left;
    width: 10rem;
    line-height: 4rem;
    padding-right: 1rem;
    font-weight: 100;
    text-align: right;
    letter-spacing: 1px;
  }

  .premade_input {
    padding: 0 1rem;
    width: 100vw;
    max-width: 30rem;
    height: 4rem;
    color: #bbb;
    text-shadow: 1px 1px 1px black;
    background: rgba(0, 0, 0, 0.16);
    -webkit-box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.3), 0 1px rgba(255, 255, 255, 0.06);
    -moz-box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.3), 0 1px rgba(255, 255, 255, 0.06);
    box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.3), 0 1px rgba(255, 255, 255, 0.06);
    @include border-radius(5px);
  }

  @media only screen and (max-width: 650px) {
    .display_flex {
      flex-direction: column;
    }
    .premade_login_box--item {
      margin: .5rem 0;
    }
    .premade_login_box--login {
      margin: 2rem 0;
      width: 100%;
      button {
        width: 100%;
        height: 4rem;
        line-height: 4rem;
      }
    }
    .premade_label {
      display: block;
      width: 100%;
      float: none;
      text-align: left;
    }
  }

  @media only screen and (max-width: 400px) {
    .premade_input {
      max-width: 28rem;
    }
  }

  @media only screen and (max-height: 430px) {
    .premade_login--logo {
      display: none;
    }
  }

</style>
