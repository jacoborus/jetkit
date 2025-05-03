<script setup lang="ts">
import { ref } from "vue";
import router from "@/router";
import { authClient } from "@/auth/auth-client";
import CenteredLayout from "@/components/ui/CenteredLayout.vue";

const isVerified = ref(false);
const isError = ref(false);

const token = new URLSearchParams(window.location.search).get("token");

if (!token) {
  console.error("No token found in URL");
  isError.value = true;
} else {
  authClient.verifyEmail({ query: { token } }).then(({ error }) => {
    if (error) {
      isError.value = true;
      return;
    }
    isVerified.value = true;
    router.push({ name: "SignIn" });
  });
}
</script>

<template>
  <CenteredLayout>
    <h1>Email verification page</h1>
    <p v-if="isError">Your token is invalid</p>
    <template v-else>
      <p v-if="isVerified">We're trying to verify your email...</p>
      <p v-else>
        You're email is verified. You can proceed to
        <router-link :to="{ name: 'SignIn' }">sign in</router-link>
      </p>
    </template>
  </CenteredLayout>
</template>
