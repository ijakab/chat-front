<template>
  <div class="modal fade" id="updateChatModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Update chat</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group">
              <label for="recipient-name" class="col-form-label">Title:</label>
              <input type="text" class="form-control" id="recipient-name" v-model="title">
            </div>
            <div class="form-group">
              <label for="message-text" class="col-form-label">Users:</label>
              <input type="text" class="form-control" id="message-text" v-on:keyup="searchUsers" v-model="searchText" />
            </div>
            <a href="#" v-for="user in selectedUsers" :key="user.id" v-on:click="unselectUser(user)" class="badge badge-primary">{{user.displayName}}</a>
            <div class="list-group" >
              <a href="#" class="list-group-item list-group-item-action" v-for="user in foundUsers" :key="user.id" v-on:click="selectUser(user)" v-if="!selectedUsers.find(selectedUser => selectedUser.id === user.id)">
                <img width="20" height="20" v-if="user.details.profileImage" v-bind:src="apiBase + '/' + user.details.profileImage.path">
                {{user.details.displayName}}
              </a>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" v-on:click="updateChat" data-dismiss="exampleModal">Update</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import debounce from 'lodash/debounce'
  import env from '~/env'

  export default {
    data: function() {
      return {
        searchText: '',
        foundUsers: [],
        selectedUsers: Object.values(this.chat.users),
        apiBase: env.env.apiBaseUrl,
        title: this.chat.title
      }
    },

    props: ['chat'],

    methods: {
      searchUsers: debounce(async function (){
        let res = await this.$axios.post('/api/v1/user/filter', {
          keywords: this.searchText
        })
        this.foundUsers = res.data.data.records
      }, 300),

      selectUser(user) {
        Object.assign(user, user.details)
        this.selectedUsers.push(user)
      },

      unselectUser(user) {
        let index = this.selectedUsers.indexOf(user)
        if(index !== -1) {
          this.selectedUsers.splice(index, 1)
        }
      },

      updateChat() {
        let userIds = this.selectedUsers.map(user => user.id)
        this.$adonisWs.userChannel.emit('updateChat', {
          chatId: this.chat.id,
          userIds,
          title: this.title
        })
      }
    },
  }
</script>
