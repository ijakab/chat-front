export const state = () => ({
  chats: [],
});

export const mutations = {
  setChats(state, chats) {
    state.chats = chats
  },
};

export const actions = {
  async getMyChats({state, commit}) {
    let chats = await this.$socketRequestService.get('user/chats')
    commit('setChats', chats)
  },
}
