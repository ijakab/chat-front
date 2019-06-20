export const state = () => ({
  isLoaded: false,
  meta: {},
  scrollCounter: 0
});

export const mutations = {
  setReady(state) {
    state.isLoaded = true
  },
  setMeta(state, meta) {
    state.meta = meta
  },
  scroll(state) {
    state.scrollCounter++
  }
};

export const actions = {
  async fetchMeta({commit}) {
    let meta = await this.$socketRequestService.getOrFail('chatMeta/all')
    commit('setMeta', meta)
  },
  
};
