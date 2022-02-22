<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="350">
      <template v-slot:activator="{ on, attrs }">
        <!-- 重要 -->
        <!-- :disabled="view != 'hand' || card_total==0" -->
        <v-col cols="4">
          <v-btn v-bind="attrs" v-on="on"><v-icon>mdi-send</v-icon></v-btn>
        </v-col>
      </template>

      <v-card>
        <v-card-title class="text-h6 grey lighten-2">
          Send this card to
        </v-card-title>

        <v-divider></v-divider>
        <v-container fluid>
        <v-card-text v-show="otherPlayers.length == 0"  class="text-h5"> There's no other players </v-card-text>
          <v-row align="center">
            <v-col
              cols="12"
              sm="6"
              v-for="p in otherPlayers"
              :key="p"
            >
              <div class="text-center">
                <div>
                  <v-btn
                    class="player"
                    large
                    color="primary"
                    dark
                    @click="send(p)"
                  >
                    {{ p }}
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" large text @click="dialog = false">
            back
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang='scss' scoped>
.player {
  text-transform: none;
}
</style>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      dialog: false,
    };
  },
  computed: {
    ...mapState(["room", "player", "card_n", "client", "view", "players"]),
    otherPlayers() {
      return this.players.filter((player_name) =>{
        return player_name != this.player;
      });
    },
  },
  methods: {
    send(player_to) {
      const info = {
        task: "send",
        room: this.room,
        player: this.player,
        to: player_to,
        card_index: this.card_n[this.view] - 1,
      };
      this.client.send(JSON.stringify(info));
    },
  },
};
</script>