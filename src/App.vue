<script setup lang="ts">
import NavMenu from "@/components/ui/NavMenu.vue";
import ModalList from "@/components/ui/ModalList.vue";
import NotificationList from "@/components/ui/NotificationList.vue";
</script>

<template>
  <div class="flex h-full">
    <NavMenu />
    <RouterView />
  </div>
  <ModalList />
  <NotificationList />
</template>
