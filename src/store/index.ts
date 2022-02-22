/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    room: "",
    player: "",
    identity: "",
    client: null as any,
    players_num: 0,
    
    title:""
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
    setPlayersNum(state,players_num){
      state.players_num=players_num
    },
    setTitle(state,title){
      state.title=title
    },

    connect(state) {
      state.client = new WebSocket("ws://47.107.143.38:6503/", "echo-protocol")
      state.client.onopen = function () {
        // 建立ws连接，并且更新房间内所有玩家的“玩家人数”数值
        const info = {
          task: "connect",
          room: state.room,
          player: state.player
        }
        state.client.send(JSON.stringify(info))
      }

      state.client.onmessage = function (e: any) {
        // console.log(e.data);        
        const data = JSON.parse(e.data);
        switch (data.task) {
          case "updatePlayersNum":
            state.players_num = data.num;
            break
        }
      };

    //   state.client.onclose = function() {
    //     const info = {
    //       task: "exit",
    //       room: state.room,
    //       player: state.player
    //     }
    //     state.client.send(JSON.stringify(info))
    //     console.log("sent");
        
    // };


    },

  },
  actions: {},
  modules: {},
});
