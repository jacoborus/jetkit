import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";
import { useAuthStore } from "./store/auth-store";
import "@/rpc/rpc-client";

const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(pinia);
useAuthStore().init();
app.mount("#app");
