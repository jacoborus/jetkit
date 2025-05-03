<script setup lang="ts">
import { Info, CircleX, CircleCheckBig } from "lucide-vue-next";
import PopUp from "@/components/ui/PopUp.vue";
import { useUiStore } from "@/store/ui-store";

const uiStore = useUiStore();

function iconType(type: "info" | "error" | "success") {
  if (type === "info") return Info;
  if (type === "error") return CircleX;
  if (type === "success") return CircleCheckBig;
}
</script>

<template>
  <div className="modals-list">
    <PopUp
      v-for="m in uiStore.modals"
      key="{m.id}"
      :buttons="m.buttons"
      :cancel-text="m.cancelText"
      :show-cancel-button="m.showCancelButton"
      :show-close-button="m.showCloseButton"
      :isOpen="true"
      :close="() => uiStore.removeModal(m.id)"
    >
      <component :is="iconType(m.kind)" />
      <h1 className="text-lg">{{ m.title }}</h1>
      <p>{{ m.message }}</p>
    </PopUp>
  </div>
</template>
