<template>
  <v-container>
    <h2 class="mb-3">Join Room</h2>
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
      <v-col cols="6">
        <v-btn @click="joinRoom">OK</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
/* eslint-disable */
export default {
  data: () => ({
    rules: [(value) => !!value || "Required."],
    room: "",
    player: "",
  }),
  methods: {
    back() {
      this.$router.push("/");
    },
    joinRoom() {
      if (this.player == "" || this.room == "") {
        return;
      }

      // this.$store.commit("setRoom", this.room);
      // this.$store.commit("setPlayer", this.player);

      // this.$store.commit("connect", "join");
      // this.$store.state.client.onmessage = function (e) {
      //   const data = JSON.parse(e.data);
      //   switch (data.task) {
      //     case "updatePlayersNum":
      //       state.players_num = data.num;
      //       break;
      //     case "join":
      //       break;
      //   }
      // };
      // todo Create那边也要改

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
          this.$store.commit("setPlayersNum", data.data.players_num);
          // this.$store.commit("connect");
          // this.$router.push(data.data.identity);
          this.$router.push("/play");
        });

      // if (rooms[this.room].creater.name == this.player) {
      //   this.$store.commit("setIdentity", "Creator");
      //   this.$router.push("/creator_view");
      // } else {
      //   this.$store.commit("setIdentity", "Player");
      //   this.$router.push("/player_view");
      // }
    },
  },
};
</script>