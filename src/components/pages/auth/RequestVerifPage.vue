<script setup lang="ts">
import { ref } from "vue";
import router from "@/router";
import { authClient } from "@/auth/auth-client";
import { onBeforeRouteUpdate } from "vue-router";
import CenteredLayout from "@/components/ui/CenteredLayout.vue";

const email = ref(
  new URLSearchParams(window.location.search).get("email")?.trim() || "",
);
const isSent = ref(false);
const isError = ref(false);
const newEmail = ref("");

if (email.value && !isSent.value) {
  requestVerificationEmail();
}

onBeforeRouteUpdate(async (to, from) => {
  if (to.query.email && to.query.email !== from.query.email) {
    requestVerificationEmail((to.query.email as string) || "");
  }
});

async function requestVerificationEmail(queryEmail?: string) {
  const { error } = await authClient.sendVerificationEmail({
    email: queryEmail || email.value,
  });

  isSent.value = true;
  if (error) {
    isError.value = true;
  }
}

function requestNewOne() {
  router.push({ name: "RequestVerifyEmail", query: { email: newEmail.value } });
}
</script>

<template>
  <CenteredLayout>
    <h1>Request email verification</h1>
    isSent: {{ isSent }}
    <div v-if="!isSent">
      <label for="new-email">Introduce email to request validation</label>
      <fieldset role="group">
        <input id="new-email" type="text" v-model="newEmail" />
        <button @click="requestNewOne">Send</button>
      </fieldset>
    </div>

    <template v-else>
      <p v-if="isError">Something wrong happened, please, try again later</p>
      <template v-else>
        <p>
          Please check your email and follow the instructions to validate your
          account
        </p>
      </template>
    </template>
  </CenteredLayout>
</template>
