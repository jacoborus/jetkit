<script setup lang="ts">
import CenteredLayout from "@/components/ui/CenteredLayout.vue";
import { reactive, ref } from "vue";
import router from "@/router";
import { useAuthStore } from "@/store/auth-store";

const authStore = useAuthStore();
const formData = reactive({ email: "", password: "", name: "" });
const isLoading = ref(false);

async function signup() {
  isLoading.value = true;
  const { data, error } = await authStore.signUp(formData);
  isLoading.value = false;

  if (error) {
    console.log(error);
    return;
  }
  authStore.setLoggedIn(data.user);

  router.push({ name: "Home" });
}
</script>

<template>
  <CenteredLayout>
    <div class="w-max">
      <h1 class="text-2xl">Sign Up!</h1>
      <div class="divider"></div>

      <form @submit.prevent="signup" class="flex flex-col gap-5 w-72">
        <fieldset class="fieldset">
          <legend class="fieldset-legend text-base">Name</legend>
          <input
            type="text"
            id="name"
            name="name"
            v-model="formData.name"
            required
            class="input"
          />
        </fieldset>

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

        <router-link :to="{ name: 'SignIn' }" class="link text-center">
          Already have an account? Sign In
        </router-link>
      </form>
    </div>
  </CenteredLayout>
</template>
