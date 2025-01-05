/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import App from "./App.vue";
import "./assets/main.css";
import { registerPlugins } from "@/plugins";
import { createRouter, createWebHistory } from "vue-router";

// Components

import Accesso from "./components/Accesso.vue";
import Home from "./components/home.vue";
import Pokemon from "./components/pokemon.vue";
import Profilo from "./components/profilo.vue";
import modificaProfilo from "./components/modifyprofile.vue";
import Ricerca from "./components/ricerca.vue";

import DataService from "./dataservice";

// Composables
import { createApp } from "vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Accesso, name: "accesso" },
    { path: "/", component: Home, name: "home" },
    { path: "/ricerca", component: Ricerca, name: "ricerca" },
    { path: "/profilo:userId", component: Profilo, name: "profilo" },
    { path: "/profilo:userId/modifica", component: modificaProfilo, name: "modificaProfilo" },

    { path: "/pokemon:opId", component: Pokemon, name: "pokemon" }
  ],
});

router.beforeEach(async (to:any, from:any) => {
  if (!DataService.isAuthenticated() && to.name !== "accesso") {
      return { name: "accesso" };
  }
  if (DataService.isAuthenticated() && to.name === "accesso") {
    return { name: "home" };
  }
});

const app = createApp(App);

registerPlugins(app);
app.use(router);
app.mount("#app");
