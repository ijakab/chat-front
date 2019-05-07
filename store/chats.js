export const state = () => ({
  chats: [],
});

export const mutations = {
  setChats(state, chats) {
    state.chats = chats
  },
  addChat(state, chat) {
    state.chats.unshift(chat)
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
