<script setup lang="ts">
import CenteredLayout from "@/components/ui/CenteredLayout.vue";
import { ref } from "vue";
import { authClient } from "@/auth/auth-client";

const isSent = ref(false);
const isError = ref(false);
const email = ref("");

async function requestNewOne() {
  const { error } = await authClient.forgetPassword({
    email: email.value,
    redirectTo: "/reset-password",
  });
  isSent.value = true;
  if (error) {
    isError.value = true;
  }
}
</script>

<template>
  <CenteredLayout>
    <h1 class="text-3xl text-bold">Request reset password</h1>
    <br />

    <div v-if="!isSent">
      <fieldset class="fieldset">
        <legend for="new-email" class="fieldset-legend text-base">
          Introduce email to request validation
        </legend>
        <input id="new-email" type="text" v-model="email" class="input" />

        <button @click="requestNewOne" class="btn">Send</button>
      </fieldset>
    </div>

    <template v-else>
      <p v-if="isError" class="text-error">
        Something wrong happened, please, try again later
      </p>

      <template v-else>
        <p class="text-success">
          Please check your email and follow the instructions to validate your
          account
        </p>
      </template>
    </template>
  </CenteredLayout>
</template>
