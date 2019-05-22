export const actions = {
  
  async nuxtServerInit ({ dispatch }) {
    await dispatch('general/fetchMeta')
  }
};
