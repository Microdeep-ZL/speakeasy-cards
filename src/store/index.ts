import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    room: "",
    player: "",
    identity: "",
  },
  getters: {},
  mutations: {
    setRoom(state, room) {
      state.room = room;
    },
    setPlayer(state, player) {
      state.player = player;
    },
    setIdentity(state, identity) {
      state.identity = identity;
    },
  },
  actions: {},
  modules: {},
});
