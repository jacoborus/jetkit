<script setup lang="ts">
import { Info, CircleX, CircleCheckBig, XIcon } from "lucide-vue-next";
import { useUiStore } from "@/store/ui-store";

const uiStore = useUiStore();

function iconType(type: "info" | "error" | "success") {
  if (type === "info") return Info;
  if (type === "error") return CircleX;
  if (type === "success") return CircleCheckBig;
}
</script>

<template>
  <div className="toast toast-top toast-end">
    <div
      v-for="n in uiStore.notifications"
      :key="n.id"
      role="alert"
      class="alert"
      :class="{
        'alert-error': n.kind === 'error',
        'alert-info': n.kind === 'info',
        'alert-success': n.kind === 'success',
      }"
    >
      <component :is="iconType(n.kind)" />

      <span className="text-base">{{ n.message }}</span>

      <button
        v-if="n.showCloseButton"
        @click="() => uiStore.removeNotification(n.id)"
        className="btn btn-sm btn-ghost"
      >
        <XIcon :size="18" />
      </button>
    </div>
  </div>
</template>
