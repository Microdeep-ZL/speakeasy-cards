<template>
  <v-container>
    <h2 class="mb-3">{{title}}</h2>
    <v-row>
      <v-col cols="12">
        <div>
          <div class="my-1">
            <v-text-field
              label="Room Name"
              :rules="rules"
              hide-details="auto"
              v-model="room"
            ></v-text-field>
          </div>
        </div>
      </v-col>

      <v-col cols="12">
        <div>
          <div class="my-1">
            <v-text-field
              label="Player Name"
              :rules="rules"
              hide-details="auto"
              v-model="player"
            ></v-text-field>
          </div>
        </div>
      </v-col>

      <v-col cols="6">
        <v-btn @click="back">Back</v-btn>
      </v-col>
      <v-col cols="6" v-if="title=='Create Room'">
        <v-btn @click="createRoom">OK</v-btn>
      </v-col>
      <v-col cols="6" v-else>
        <v-btn @click="joinRoom">OK</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import {mapState} from "vuex"
/* eslint-disable */
export default {
  data: () => ({
    rules: [(value) => !!value || "Required."],
    room: "",
    player: "",
    
  }),
  computed:{
    ...mapState(["title"]),

  },
  methods: {
    back() {
      this.$router.push("/");
    },
    
    createRoom() {
      if (this.player == "" || this.room == "") {
        return;
      }

      axios
        .get("http://47.107.143.38:6503", {
          params: {
            task: "create",
            room: this.room,
            player: this.player,
          },
        })
        .then(
          (data) => {
            if (data.data.used) {
              alert("The room name has been used!");
              return;
            }
            this.$store.commit("setRoom", this.room);
            this.$store.commit("setPlayer", this.player);
            this.$store.commit("setIdentity", "Creator");
            // this.$store.commit("setPlayersNum", 1);
            // this.$store.commit("connect")
            // this.$router.push("/Creator");
            this.$router.push("/play");
          },
          (err) => {
            console.log(err);
          }
        );
    },

    joinRoom() {
      if (this.player == "" || this.room == "") {
        return;
      }
      axios
        .get(
          "http://47.107.143.38:6503?task=join&room=" +
            this.room +
            "&player=" +
            this.player
        )
        .then((data) => {
          if (data.data.notCreated) {
            alert("The room has not been created!");
            return;
          }
          this.$store.commit("setRoom", this.room);
          this.$store.commit("setPlayer", this.player);
          this.$store.commit("setIdentity", data.data.identity);
          // this.$store.commit("setPlayersNum", data.data.players_num);
          this.$router.push("/play");
        });
    },
  },
};
</script>