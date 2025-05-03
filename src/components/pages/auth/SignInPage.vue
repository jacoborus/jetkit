<script setup lang="ts">
import CenteredLayout from "@/components/ui/CenteredLayout.vue";
import { reactive, ref } from "vue";
import { useAuthStore } from "@/store/auth-store";
import router from "@/router";

const formData = reactive({ email: "", password: "" });
const isLoading = ref(false);

async function login() {
  isLoading.value = true;
  const success = await useAuthStore().singIn({
    email: formData.email,
    password: formData.password,
  });
  isLoading.value = false;
  if (success) router.push({ name: "Home" });
}
</script>

<template>
  <CenteredLayout>
    <div class="w-max">
      <h1 class="text-2xl">Sign In</h1>
      <div class="divider"></div>

      <form @submit.prevent="login" class="flex flex-col gap-5 w-72">
        <fieldset class="fieldset">
          <legend class="fieldset-legend text-base">Email</legend>
          <input
            type="text"
            id="email"
            name="email"
            v-model="formData.email"
            required
            class="input"
          />
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend text-base">Password</legend>
          <input
            type="password"
            id="password"
            name="password"
            v-model="formData.password"
            required
            class="input"
          />
        </fieldset>

        <fieldset class="fieldset">
          <button type="submit" class="btn btn-info">Enter</button>
        </fieldset>

        <router-link :to="{ name: 'ForgotPassword' }" class="link text-center">
          Forgot password?
        </router-link>

        <router-link :to="{ name: 'SignUp' }" class="link text-center">
          Need an account? Sign up
        </router-link>
      </form>
    </div>
  </CenteredLayout>
</template>
