import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      isAuthenticated: false,
      user: null
    };
  },
  mutations: {
    setAuthenticated(state, payload) {
      state.isAuthenticated = payload.isAuthenticated;
      state.user = payload.user || null;
    },
  },
  actions: {
    login({ commit }, user) {
      commit('setAuthenticated', { isAuthenticated: true, user });
    },
    logout({ commit }) {
      commit('setAuthenticated', { isAuthenticated: false, user: null });
    },
  },
});

export default store;
