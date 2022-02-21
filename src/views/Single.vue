<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="3">
        <h3>Draw Cards</h3>
      </v-col>
      <v-col cols="2" v-for="i in [1, 3, 5, 8]" :key="'image' + i">
        <v-btn small @click="draw(i)">{{ i }}</v-btn>
      </v-col>

      <v-col cols="12">
        <v-img :src="img_path" class="my-3" contain height="350" />
      </v-col>

      <v-col>
        <v-btn @click="previous">previous</v-btn>
      </v-col>
      <v-col>
        <v-btn @click="flip">flip</v-btn>
      </v-col>
      <v-col>
        <v-btn @click="next">next</v-btn>
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

export default Vue.extend({
  name: "HelloWorld",

  data: () => ({
    folder: "images/image",
    nums: [1],

    card_n: 1,
    card_total: 1,

    first_alarm: false,
    last_alarm: false,
  }),
  computed: {
    img_path() {
      return require("../" + this.folder + this.nums[this.card_n - 1] + ".jpg");
    },
  },
  methods: {
    draw(cards: number) {
      this.last_alarm = false;
      this.first_alarm = false;

      this.card_total = cards;
      this.nums = [];
      for (var i = 0; i < cards; i++) {
        let a;
        do {
          a = Math.floor(Math.random() * 54) + 1; // random number from 1 to 54
        } while (a in this.nums);
        this.nums.push(a);
      }
    },
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
  },
});
</script>
