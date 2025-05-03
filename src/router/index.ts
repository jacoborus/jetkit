import {
  createWebHistory,
  createRouter,
  type RouteRecordRaw,
} from "vue-router";

import HomePage from "@/pages/HomePage.vue";
import authRoutes from "./auth-routes";

import { useAuthStore } from "@/store/auth-store";
import TodoList from "@/components/TodoList.vue";

const routes: RouteRecordRaw[] = [
  { path: "/", component: HomePage, name: "Home" },
  ...authRoutes,
  {
    path: "/todos",
    component: TodoList,
    name: "Todos",
    meta: { private: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const isLoggedIn = useAuthStore().isLoggedIn;
  if (to.meta.private && !isLoggedIn) {
    return next({ name: "SignIn" });
  }
  if ((to.name === "SignIn" || to.name === "SignUp") && isLoggedIn) {
    return next({ name: "Home" });
  }
  next();
});

export default router;
