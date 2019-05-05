export const state = () => ({
  chats: [],
  bla: ''
});

export const mutations = {
  setChats(state, chats) {
    state.chats = chats
    state.bla = 'sdfd'
  },
};

export const actions = {
  async getMyChats({state, commit}) {
    let response = await this.$socketRequestService.get('user/chats')
    commit('setChats', response.chats)
  },
}
