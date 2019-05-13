import {keyBy} from 'lodash'

export const state = () => ({
  chats: [],
});

export const mutations = {
  setChats(state, chats) {
    for(let chat of chats) {
      chat.users = keyBy(chat.users, user => user.id)
    }
    state.chats = chats
  },
  putToTop(state, id) {
    let chat = state.chats.find(chat => chat.id === id)
    let index = state.chats.indexOf(chat)
    state.chats.splice(index, 1)
    state.chats.unshift(chat)
  },
  addChat(state, chat) {
    chat.users = keyBy(chat.users, user => user.id)
    state.chats.unshift(chat)
  },
  addMessageFromSocket(state, message) {
    let chat = state.chats.find(c => c.id === message.chatId)
    chat.lastMessage = message
    if(!chat.messages) chat.messages = []
    chat.messages.push(message)
  },
  seenChat(state, chatId) {
    let chat = state.chats.find(c => c.id === chatId)
    chat.me.unread = 0
  },
  addMessagesToChat(state, {chat, messages}) {
    if(!chat.messages) chat.messages = []
    chat.messages.push(...messages)
  }
};

export const actions = {
  async getMyChats({commit}) {
    let chats = await this.$socketRequestService.post('chats/filter')
    commit('setChats', chats)
  },
  async getChatMessages({commit, state}, chatOrId) {
    let chat = typeof chatOrId === 'number' ? state.chats.find(chat => chat.id === chatOrId) : chatOrId
    let messages = await this.$socketRequestService.post(`messages/${chat.id}/filter`)
    commit('addMessagesToChat', {chat, messages: messages.data})
  }
}
