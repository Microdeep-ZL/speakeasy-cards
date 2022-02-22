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
    card_n: { table: 0, hand: 0 },

    title: "",

    cards: { table: [], hand: [] },
    view: "table" as "table" | "hand",

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
    setPlayersNum(state, players_num) {
      state.players_num = players_num
    },
    setTitle(state, title) {
      state.title = title
    },

    switchView(state) {
      state.view = state.view == "table" ? "hand" : "table";
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
        const data = JSON.parse(e.data) as { view: "hand" | "table", [xx: string]: any };
        console.log("Received message\n", data);

        switch (data.task) {
          case "updatePlayersNum":
            state.players_num = data.num;
            break
          case "draw":
          case "pick":
            state.cards[data.view] = data.cards
            if (data.task == "draw") {
              // 如果增加牌，则立即看到新添的牌。如果减少牌，则card_n不变
              state.card_n[data.view] = state.cards[data.view].length
            }
            break
        }
      };

      state.client.onclose = function () {
        // 断线重连




        // const info = {
        //   task: "exit",
        //   room: state.room,
        //   player: state.player
        // }
        // state.client.send(JSON.stringify(info))
        // console.log("sent");

      };


    },

  },
  actions: {},
  modules: {},
});
