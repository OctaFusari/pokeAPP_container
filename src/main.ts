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
import Opera from "./components/opera.vue";
import Profilo from "./components/profilo.vue";
import modificaProfilo from "./components/modifyprofile.vue";
import Ricerca from "./components/ricerca.vue";
import Artista from "./components/artista.vue";

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
    { path: "/artista:arId", component: Artista, name: "artista" },
    { path: "/opera:opId", component: Opera, name: "opera" }
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
