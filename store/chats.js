export const state = () => ({
  data: [],
  lastId: 1,
  perPage: 5
});

export const mutations = {
  newPage(state, posts, firstCall) {if (firstCall) {
      state.data = posts
    } else {
      state.data.push(...posts)
    }
    if (!posts.length) {
      state.lastId = 0
      return
    }
    state.lastId = posts[posts.length - 1].id
  },

  removeItem(state, id) {
    let index = state.data.findIndex(post => post.id === id)
    state.data.splice(index, 1)
  }
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
