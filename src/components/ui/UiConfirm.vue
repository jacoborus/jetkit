<script setup lang="ts">
defineProps<{
  message?: string;
  acceptText?: string;
  cancelText?: string;
  resolve: (value: boolean) => void;
}>();
</script>

<template>
  <dialog ref="{ref}" className="modal">
    <div className="modal-box">
      {message || children}
      <div className="modal-action">
        <button className="btn" @click="() => resolve(true)">
          {{ acceptText || "Yes" }}
        </button>
        <button className="btn" @click="() => resolve(false)">
          {{ cancelText || "No" }}
        </button>
      </div>
    </div>
  </dialog>
</template>
