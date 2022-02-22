<template>
  <v-container>
    <h2 class="mb-6">Welcome to Speakeasy Cards!</h2>
    <v-row>
      <v-col cols="12" v-for="b in buttons" :key="b.name">
        <div>
          <div class="my-1">
            <v-btn @click="to(b)">{{ b.name }}</v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      buttons: [
        { name: "Create Room", path: "join" },
        { name: "Join Room", path: "join" },
        { name: "Single Play", path: "single" },
      ],
    };
  },
  methods: {
    to(b:any) {
      this.$store.commit("setTitle",b.name)
      this.$router.push(b.path);
    },
  },
});
</script>
