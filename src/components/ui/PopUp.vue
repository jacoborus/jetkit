<script setup lang="ts">
defineProps<{
  buttons?: { name: string; onClick: (close: () => void) => void }[];
  cancelText?: string;
  showCancelButton?: boolean;
  showCloseButton?: boolean;
  isOpen?: boolean;
  close: () => void;
}>();
</script>

<template>
  <dialog :open="isOpen" class="modal backdrop-blur-xs">
    <div className="modal-box">
      <button
        v-if="showCloseButton"
        @click="close"
        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
      >
        ✕
      </button>

      <slot />

      <div className="modal-action">
        <button
          v-for="(button, i) in buttons"
          className="btn btn-primary"
          @click="() => button.onClick(close)"
          :key="i"
        >
          {{ button.name }}
        </button>

        <button v-if="showCancelButton" @click="close" className="btn">
          {cancelText || "Close"}
        </button>
      </div>
    </div>
  </dialog>
</template>
