/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    room: "",
    player: "",
    identity: "" as "Creator" | "Player",
    client: null as any,

    players: [],

    card_n: { table: 0, hand: 0 },

    title: "",

    cards: { table: [], hand: [] },
    view: "table" as "table" | "hand",

    phone_info: 'phone_info',
    folder: { table: "images/image", hand: "images/image" } as { [xx: string]: "images/image" | "questions/question" }

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
    setTitle(state, title) {
      state.title = title
    },

    switchView(state) {
      state.view = state.view == "table" ? "hand" : "table";
    },

    connect(state) {
      //1.创建websocket客户端
      const server_address = "ws://47.107.143.38:6503/";
      var limitConnect = 3;  // 断线重连次数
      var timeConnect = 0;
      webSocketInit(server_address)

      // 心跳回应
      setInterval(function () {
        state.client.send('');
      }, 1000 * 100);

      //socket初始化
      function webSocketInit(service: string) {
        var ws = new WebSocket(service, "echo-protocol");
        ws.onopen = function () {
          console.log("ws connected!"); state.phone_info = "ws connected!"
          // 建立ws连接，并且更新房间内所有玩家的“玩家人数”数值
          const info = {
            task: "connect",
            room: state.room,
            player: state.player
          }
          state.client.send(JSON.stringify(info))
        };
        ws.onmessage = function (e) {
          // 和服务器的交互
          const data = JSON.parse(e.data) as { view: "hand" | "table", [xx: string]: any };
          console.log("Received message\n", data);

          switch (data.task) {
            case "updatePlayers":
              state.players = data.players;
              break
            case "draw":
              const is_more = state.cards[data.view].length < data.cards.length
              state.cards[data.view] = data.cards
              if (is_more || state.card_n[data.view] > state.cards[data.view].length) {
                state.card_n[data.view] = state.cards[data.view].length
              }
              break
            case "flipTable":
              state.folder.table=data.tableFolder
              break
          }

        };

        ws.onclose = function () {
          console.log('ws disconnected!'); state.phone_info = 'ws disconnected!'
          reconnect(service);
        };

        state.client = ws

      }

      // 重连
      function reconnect(service: string) {
        if (limitConnect > 0) {
          limitConnect--;
          timeConnect++;
          console.log("第" + timeConnect + "次重连"); state.phone_info = "第" + timeConnect + "次重连"
          // 进行重连
          setTimeout(function () {
            webSocketInit(service);
          }, 2000);
        } else {
          console.log("connection time out"); state.phone_info = "connection time out"
        }
      }
    },
    flipPersonalFolder(state) {
      if (state.folder.hand == "images/image") {
        state.folder.hand = "questions/question";
      } else {
        state.folder.hand = "images/image";
      }
    }

  },
  actions: {},
  modules: {},
});
