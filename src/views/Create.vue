<template>
  <v-container>
    <h2 class="mb-3">Create Room</h2>
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
        <v-btn @click="createRoom">OK</v-btn>
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
    createRoom() {
      if (this.player == "" || this.room == "") {
        return;
      }

      // let rooms = require("@/assets/rooms.json");
      // if (rooms[this.room] != undefined) {
      //   alert("The room name has been used!");
      //   return;
      // }

      axios
        .get("http://localhost:8081", {
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
            this.$router.push("/Creator");
          },
          (err) => {
            console.log(err);
          }
        );
      // this.$router.push()
    },
  },
};
</script>