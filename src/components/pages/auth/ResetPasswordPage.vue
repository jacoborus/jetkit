<script setup lang="ts">
import { ref } from "vue";
import router from "@/router/index";
import { authClient } from "@/auth/auth-client";
import CenteredLayout from "@/components/ui/CenteredLayout.vue";
import { useUiStore } from "@/store/ui-store";

const uiStore = useUiStore();
const token = ref(
  new URLSearchParams(window.location.search).get("token")?.trim() || "",
);
const isLoading = ref(false);
const isSent = ref(false);
const isError = ref(false);
const password = ref("");
const errorMessage = ref("");

if (!token.value) {
  isError.value = true;
}

async function resetPassword() {
  if (isLoading.value) return;
  const { error } = await authClient.resetPassword({
    newPassword: password.value,
    token: token.value,
  });

  isLoading.value = false;
  isSent.value = true;
  if (error) {
    console.log(error);
    uiStore.notify(
      error.message || "Something went wrong, please try again later",
      {
        kind: "error",
      },
    );
    isError.value = true;
    errorMessage.value = error.message || "";
  } else {
    router.push({ name: "Signin" });
  }
}

function tryAgain() {
  isError.value = false;
  isSent.value = false;
  password.value = "";
  errorMessage.value = "";
}
</script>

<template>
  <CenteredLayout>
    <div class="w-max">
      <h1 class="text-2xl">Reset password</h1>
      <div class="divider"></div>

      <div v-if="!isSent && !isError">
        <form @submit.prevent="resetPassword" class="flex flex-col gap-5 w-72">
          <fieldset class="fieldset">
            <legend class="fieldset-legend text-base">Password</legend>
            <input
              type="password"
              id="password"
              name="password"
              v-model="password"
              required
              class="input"
            />
          </fieldset>

          <fieldset class="fieldset">
            <button type="submit" class="btn btn-info">Send</button>
          </fieldset>
        </form>
      </div>

      <template v-if="isSent && !isError">
        <p>Your credentials have been updated.</p>
        <router-link to="{name: 'SignIn'}" class="btn btn-success"
          >Sign in</router-link
        >
      </template>

      <p v-if="isError">
        {{
          errorMessage || "Something wrong happened, please, try again later"
        }}

        <button @click="tryAgain" class="btn">Try again</button>
      </p>
    </div>
  </CenteredLayout>
</template>
