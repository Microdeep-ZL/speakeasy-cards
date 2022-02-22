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
            this.$store.commit("setPlayersNum", 1);
            // this.$store.commit("connect")
            // this.$router.push("/Creator");
            this.$router.push("/play");
          },
          (err) => {
            console.log(err);
          }
        );
    },

    connect() {
      var client = new WebSocket("ws://47.107.143.38:8080/", "echo-protocol");
      client.onmessage = function (e) {
        // alert(e.data)
        console.log("Received: '" + e.data + "'");
      };
      client.onopen = function (res) {
        let info = {
          room: this.room,
          player: this.player,
        };
        client.send(JSON.stringify(info));
      };
    },
  },
};
</script>