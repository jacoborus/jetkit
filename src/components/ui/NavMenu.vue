<script lang="ts" setup>
import { useAuthStore } from "@/store/auth-store";
const store = useAuthStore();
</script>

<template>
  <ul class="menu bg-base-300 h-full">
    <li class="menu-title text-2xl">JetKit</li>

    <div class="divider m-1"></div>

    <li><RouterLink to="/">Home</RouterLink></li>

    <template v-if="!store.isLoggedIn">
      <span class="grow"></span>
      <li>
        <RouterLink to="/sign-in">Sign in</RouterLink>
      </li>
      <li>
        <RouterLink to="/sign-up">Sign up</RouterLink>
      </li>
    </template>

    <template v-else>
      <li>
        <RouterLink to="/todos">Todos</RouterLink>
        <RouterLink to="/chat">Chat</RouterLink>
      </li>

      <li v-if="store.isAdmin">
        <RouterLink to="/admin/users">Users</RouterLink>
      </li>

      <span class="grow"></span>

      <li>
        <button @click="store.singOut" class="btn btn-sm">Logout</button>
      </li>
    </template>
  </ul>
</template>
