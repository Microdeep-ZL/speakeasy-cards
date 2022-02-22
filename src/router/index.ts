import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/single",
    name: "single",
    component: () => import("../views/Single.vue"),
  },
  // {
  //   path: "/create",
  //   name: "create",
  //   component: () => import("../views/Create.vue"),
  // },
  {
    path: "/join",
    name: "join",
    component: () => import("../views/Join.vue"),
  },
  // {
  //   path: "/Creator",
  //   name: "creator",
  //   component: () => import("../views/PlayCreator.vue"),
  // },
  // {
  //   path: "/Player",
  //   name: "player",
  //   component: () => import("../views/PlayPlayer.vue"),
  // },
  {
    path: "/play",
    name: "play",
    component: () => import("../views/Play.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
