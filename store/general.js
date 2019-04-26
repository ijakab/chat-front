export const state = () => ({
  isLoaded: false,
  data: [],
  lastId: 1,
  perPage: 5
});

export const mutations = {
  setReady(state) {
    state.isLoaded = true
  },
};

export const actions = {
  async loadPage({state, commit}, firstCall) {
    let posts = await this.$axiosWraper.queryParams({
      afterId: firstCall ? '' : state.lastId,
      limit: state.perPage
    }).get('Post/showAll')
    commit('newPage', posts, firstCall)
  },

  async removeItem({commit}, id) {
    commit('removeItem', id)
    this.$axiosWraper.deleteOrFail(`Post/${id}`)
  }
}
