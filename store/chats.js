import {keyBy} from 'lodash'

export const state = () => ({
  chats: [],
  activeChat: 0
});

export const mutations = {
  setChats(state, chats) {
    for(let chat of chats) {
      chat.users = keyBy(chat.users, user => user.id)
      chat.currentlyTyping = []
    }
    state.chats = chats
  },
  addChat(state, chat) {
    chat.users = keyBy(chat.users, user => user.id)
    chat.currentlyTyping = []
    state.chats.unshift(chat)
  },
  putToTop(state, id) {
    let chat = state.chats.find(chat => chat.id === id)
    let index = state.chats.indexOf(chat)
    state.chats.splice(index, 1)
    state.chats.unshift(chat)
  },
  addMessageFromSocket(state, message) {
    let chat = state.chats.find(c => c.id === message.chat_id)
    if(chat.id !== state.activeChat) chat.me.unread++
    chat.lastMessage = message
    if(!chat.messages) chat.messages = []
    chat.messages.push(message)
    
    let myIndex = message.activeUsers.indexOf(chat.me.id)
    if(myIndex !== -1) message.activeUsers.splice(myIndex, 1)
    chat.seenBy = message.activeUsers
  },
  seenChat(state, chatId) {
    let chat = state.chats.find(c => c.id === chatId)
    chat.me.unread = 0
  },
  userSeenChat(state, response) {
    let chat = state.chats.find(chat => chat.id === response.chatId)
    if(chat.me.id !== response.userId && !chat.seenBy.find(id => id === response.userId )) chat.seenBy.push(response.userId)
  },
  addMessagesToChat(state, {chat, messages}) {
    if(!chat.messages) chat.messages = []
    chat.messages.push(...messages)
  },
  setActiveChat(state, id) {
    state.activeChat = id
  },
  setMyStatus(state, status) {
    for(let chat of state.chats) {
      chat.me.chatStatus = status
    }
  },
  setUserStatus(state, {userId,status}) {
    for(let chat of state.chats) {
      if(chat.users[userId]) {
        chat.users[userId].chatStatus = status
      }
    }
  },
  setTyping(state, {chatId, isTyping, userId}) {
    let chat = state.chats.find(chat => chat.id === chatId)
    if(chat.me.id === userId) return
    if(isTyping) {
      if(chat.currentlyTyping.find(id => id === userId)) return
      chat.currentlyTyping.push(userId)
    } else {
      let index = chat.currentlyTyping.indexOf(userId)
      if(index !== -1) {
        chat.currentlyTyping.splice(index, 1)
      }
    }
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
