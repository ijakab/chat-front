export const state = () => ({
  isLoaded: false,
});

export const mutations = {
  setReady(state) {
    state.isLoaded = true
  },
};
