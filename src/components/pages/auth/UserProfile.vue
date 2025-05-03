<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { authClient } from "@/auth/auth-client";
import { client } from "@/rpc/rpc-client";
import { useUiStore } from "@/store/ui-store";
import type { UserDetails } from "@/user/user-schemas";

type Session = typeof authClient.$Infer.Session.session;
const user = ref<UserDetails | undefined>();
const route = useRoute();
const userId = route.params.id as string;
const sessions = ref<Session[]>([]);

client.user.getUserDetails
  .query({ id: userId })
  .then((data) => {
    user.value = data;
  })
  .catch((error) => {
    useUiStore().notify(error.message ?? "Error fetching users:", {
      kind: "error",
    });
  });

authClient.admin
  .listUserSessions({ userId })
  .then(({ data, error }) => {
    if (error) throw error;
    sessions.value = data.sessions;
  })
  .catch((error) => {
    console.error("Error fetching user sessions:", error);
  });

function revokeSession(sessionToken: string) {
  authClient.admin.revokeUserSession({ sessionToken }).then(({ error }) => {
    if (error) throw error;
    sessions.value = sessions.value.filter((s) => s.token !== sessionToken);
  });
}

function getDeviceName(userAgent: string) {
  if (/iPhone/i.test(userAgent)) return "iPhone";
  if (/iPad/i.test(userAgent)) return "iPad";
  if (/Android/i.test(userAgent)) return "Android Device";
  if (/Windows/i.test(userAgent)) return "Windows PC";
  if (/Macintosh|MacIntel/i.test(userAgent)) return "Mac";
  if (/Linux/i.test(userAgent)) return "Linux PC";
  if (/CrOS/i.test(userAgent)) return "Chromebook";
  return "";
}
</script>

<template>
  <section id="user-profile" class="p-8 w-full">
    <ul v-if="user">
      <li>
        <router-link :to="{ name: 'UserProfile', params: { id: user.id } }">
          Name: {{ user.name }}
        </router-link>
      </li>
      <li>Email: {{ user.email }}</li>
      <li>Role: {{ user.role }}</li>
      <li>Email verified: {{ user.emailVerified ? "yes" : "no" }}</li>
      <li>Banned: {{ user.banned ? "yes" : "no" }}</li>
      <li>Created: {{ user.createdAt }}</li>
    </ul>

    <div class="divider"></div>

    <h1 class="text-xl">Sessions</h1>

    <div class="overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th>Created</th>
            <th>Updated</th>
            <th>Expires</th>
            <th>User Agent</th>
            <th>IP</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="session in sessions">
            <th>{{ session.createdAt.toISOString().split("T")[0] }}</th>
            <th>{{ session.updatedAt.toISOString().split("T")[0] }}</th>
            <th>{{ session.expiresAt.toISOString().split("T")[0] }}</th>
            <th>{{ getDeviceName(session.userAgent ?? "") }}</th>
            <th>{{ session.ipAddress }}</th>
            <th>
              <button @click="() => revokeSession(session.token)" class="btn">
                Delete
              </button>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
