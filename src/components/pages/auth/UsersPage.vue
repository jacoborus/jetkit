<script setup lang="ts">
import { ref } from "vue";
import { type UserDetails } from "@/user/user-schemas";
import { client } from "@/rpc/rpc-client";
import { useUiStore } from "@/store/ui-store";

const uiStore = useUiStore();
const users = ref<UserDetails[]>([]);

client.user.listUsers
  .query()
  .then((data) => {
    users.value = data;
  })
  .catch((error) => {
    uiStore.notify(error.message ?? "Error fetching users:", {
      kind: "error",
    });
  });
</script>

<template>
  <section id="users" class="p-8 w-full">
    <h1 class="text-xl font-bold text-base-content ml-4 mb-4">Users</h1>

    <div class="overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th>Email verified</th>
            <th>Banned</th>
            <th>Since</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.email }}</td>
            <th>
              <router-link
                class="link"
                :to="{ name: 'UserProfile', params: { id: user.id } }"
              >
                {{ user.name }}
              </router-link>
            </th>
            <td>{{ user.role }}</td>
            <td>{{ user.emailVerified ? "yes" : "no" }}</td>
            <td>{{ user.banned ? "yes" : "no" }}</td>
            <td>{{ user.createdAt.split("T")[0] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
