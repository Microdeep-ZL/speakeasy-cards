<template>
  <v-container>
    <v-row class="text-center" justify="space-around">
      <v-col cols="12">
        <h2>
          {{ room }}
        </h2>
      </v-col>
      <v-col cols="4" class="text-left caption">
        <h5>{{ identity }}: {{ player }}</h5>
      </v-col>
      <v-col cols="4" class="caption">
        <h5>players: {{ players_num }}</h5>
      </v-col>
      <v-col cols="4" class="text-right caption">
        <h5>view: {{ view }}</h5>
      </v-col>

      <v-col>
        <v-btn :disabled="!draw_view" small @click="draw(1)">Draw</v-btn>
      </v-col>

      <v-col v-show="creator_view">
        <!-- <v-btn small @click="deal(1)">Deal</v-btn> -->
        <v-btn small @click="deal(1)">Deal</v-btn>
      </v-col>

      <v-col>
        <v-btn
          :disabled="!draw_view || card_total == 0"
          small
          @click="discard()"
          >Discard</v-btn
        >
      </v-col>

      <!-- 卡牌展示 -->
      <v-col cols="12">
        <v-img :src="img_path" contain max-height="350" />
      </v-col>

      <v-col cols="4">
        <v-btn @click="previous">previous</v-btn>
      </v-col>

      <!-- 弹出对话框，选择要把卡送给谁 -->
      <the-send />

      <v-col cols="4">
        <v-btn @click="next">next</v-btn>
      </v-col>

      <v-col>
        <v-btn @click="flip">flip</v-btn>
      </v-col>
      <v-col>
        <v-btn @click="switchView"><v-icon>mdi-sync</v-icon></v-btn>
      </v-col>
      <v-col>
        <v-btn @click="pick" :disabled="pickDisable">pick</v-btn>
      </v-col>

      <v-col cols="12"> card {{ card_n[view] }}/{{ card_total }} </v-col>

      <v-col cols="12" class="red--text" v-show="first_alarm">
        This is already the first card
      </v-col>
      <v-col cols="12" class="red--text" v-show="last_alarm">
        This is already the last card
      </v-col>

      <!-- 测试用 -->
      <v-col cols="12" class="red--text">
        {{ this.$store.state.phone_info }}
      </v-col>
    </v-row>
  </v-container>
</template>


<script lang="ts">
import Vue from "vue";
import { mapMutations, mapState } from "vuex";
import TheSend from "@/components/TheSend.vue";
/* eslint-disable */

export default Vue.extend({
  name: "HelloWorld",
  components: {
    TheSend,
  },

  data: () => ({
    folder: "images/image",
    first_alarm: false,
    last_alarm: false,

    player_to: "",
    dialog: false,
  }),
  mounted() {
    // 测试用
    // window.vue=this

    if (!this.room) {
      const state = window.sessionStorage.getItem("state") as any;
      this.$store.replaceState(
        Object.assign({}, this.$store.state, JSON.parse(state))
      );
    } else {
      const state = {
        room: this.room,
        player: this.player,
        identity: this.identity,
        client: this.client,

        players: this.players,

        card_n: this.card_n,

        title: this.$store.state.title,

        cards: this.cards,
        view: this.view,

        phone_info: this.$store.state.phone_info,
      };
      window.sessionStorage.setItem("state", JSON.stringify(state));
    }

    this.$store.commit("connect");
  },
  computed: {
    pickDisable(){
     return this.view != 'table' || this.cards.table.length==0

    },
    players_num() {
      return this.players.length;
    },
    img_path() {
      try {
        return require("../" +
          this.folder +
          this.cards[this.view][this.card_n[this.view] - 1] +
          ".jpg");
      } catch (e) {
        return require("../images/nocard.jpg");
      }
    },
    card_total() {
      return this.cards[this.view].length;
    },
    creator_view() {
      if (this.identity == "Creator") {
        return true;
      }
      return false;
    },
    draw_view() {
      // 房主任何时候都可以抽牌（给自己抽，给桌子上抽）
      // 普通玩家只能给自己抽牌
      if (this.identity == "Creator") {
        return true;
      } else if (this.view == "hand") {
        return true;
      } else {
        return false;
      }
    },

    ...mapState([
      "client",
      "room",
      "player",
      "identity",
      "players",
      "cards",
      "card_n",
      "view",
    ]),
  },
  methods: {
    ...mapMutations(["switchView"]),
    discard() {
      const info = {
        task: "discard",
        room: this.room,
        player: this.player,
        view: this.view,
        card_index: this.card_n[this.view] - 1,
      };
      this.client.send(JSON.stringify(info));
    },

    deal(num: number) {
      const info = {
        task: "deal",
        room: this.room,
        num: num,
      };
      this.client.send(JSON.stringify(info));
    },

    draw(num: number) {
      const info = {
        task: "draw",
        room: this.room,
        player: this.player,
        view: this.view,
        num: num,
      };
      this.client.send(JSON.stringify(info));
    },

    sendCard() {
      // todo
    },

    previous() {
      this.last_alarm = false;
      if (this.card_n[this.view] == 1) {
        this.first_alarm = true;
      } else {
        this.card_n[this.view]--;
      }
    },
    next() {
      this.first_alarm = false;
      if (this.card_n[this.view] == this.card_total) {
        this.last_alarm = true;
      } else {
        this.card_n[this.view]++;
      }
    },

    flip() {
      if (this.folder == "images/image") {
        this.folder = "questions/question";
      } else {
        this.folder = "images/image";
      }
    },
    pick() {
      const info = {
        task: "pick",
        room: this.room,
        player: this.player,
        card_index: this.card_n.table - 1,
      };
      this.client.send(JSON.stringify(info));
    },
  },
});
</script>
