<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h2>
          {{ this.$store.state.room }}
        </h2>
      </v-col>
      <v-col cols="4" class="text-left caption">
        <h5>
          {{ this.$store.state.identity }}: {{ this.$store.state.player }}
        </h5>
      </v-col>
      <v-col cols="4" class="caption">
        <h5>players: {{ players_num }}</h5>
      </v-col>
      <v-col cols="4" class="text-right caption">
        <h5>view: {{ view }}</h5>
      </v-col>

      <v-col cols="3">
        <h3>Deal Cards</h3>
      </v-col>
      <v-col cols="2" v-for="i in [1, 3, 5, 8]" :key="'image' + i">
        <v-btn small @click="deal(i)">{{ i }}</v-btn>
      </v-col>

      <!-- 卡牌展示 -->
      <v-col cols="12">
        <v-img :src="img_path" class="my-n15" contain height="350" />
      </v-col>

      <v-col cols="6">
        <v-btn @click="previous">previous</v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn @click="next">next</v-btn>
      </v-col>
      <v-col>
        <v-btn @click="flip">flip</v-btn>
      </v-col>
      <v-col>
        <v-btn @click="switchView"><v-icon>mdi-sync</v-icon></v-btn>
      </v-col>
      <v-col>
        <v-btn @click="pick" :disabled="view != 'table'">pick</v-btn>
      </v-col>

      <v-col cols="12"> card {{ card_n }}/{{ card_total }} </v-col>

      <v-col cols="12" class="red--text" v-show="first_alarm">
        This is already the first card
      </v-col>
      <v-col cols="12" class="red--text" v-show="last_alarm">
        This is already the last card
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
/* eslint-disable */
function getRooms(fun:Function) {
  axios
    .get("http://localhost:8081", {
      params: {
        task: "getRooms",
      },
    })
    .then((data) => {
      fun(data.data)
    });
}

export default Vue.extend({
  name: "HelloWorld",

  data: () => ({
    folder: "images/image",

    nums: { table: [50, 12, 23], hand: [2, 3] },
    card_n: 1,
    // card_total: 3,

    first_alarm: false,
    last_alarm: false,

    view: "hand" as "table" | "hand",
  }),
  mounted() {
    // window.vue=this
  },
  computed: {
    img_path() {
      return require("../" +
        this.folder +
        this.nums[this.view][this.card_n - 1] +
        ".jpg");
    },
    players_num() {
      
},
    card_total() {
      return this.nums[this.view].length;
    },
  },
  methods: {
    switchView() {
      this.view = this.view == "table" ? "hand" : "table";
      // todo
    },
    _setNums() {
      // update player's cards in hand
      // let rooms = require("@/assets/rooms.json");
      getRooms((rooms:any)=>{
        for (let player of rooms[this.$store.state.room].players) {
          if (player.name == this.$store.state.player) {
            this.nums.hand = player.cards;
            break;
          }
        }

      })

      // this.card_total = this.nums.length;
    },
    deal(i: number) {
      axios.get(
        "http://localhost:8081/?task=deal&num=" +
          i +
          "&room=" +
          this.$store.state.room
      );
      // this._setNums();
    },
    // draw(cards: number) {
    //   this.last_alarm = false;
    //   this.first_alarm = false;

    //   this.nums = [];
    //   for (var i = 0; i < cards; i++) {
    //     let a;
    //     do {
    //       a = Math.floor(Math.random() * 54) + 1; // random number from 1 to 54
    //     } while (a in this.nums);
    //     this.nums.push(a);
    //   }
    // },
    previous() {
      this.last_alarm = false;
      if (this.card_n == 1) {
        this.first_alarm = true;
      } else {
        this.card_n--;
      }
    },
    next() {
      this.first_alarm = false;
      if (this.card_n == this.card_total) {
        this.last_alarm = true;
      } else {
        this.card_n++;
      }
    },

    flip() {
      if (this.folder == "images/image") {
        this.folder = "questions/question";
      } else {
        this.folder = "images/image";
      }
    },
    pick() {},
  },
});
</script>
