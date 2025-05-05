<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { client } from "@/rpc/rpc-client";
import { useUiStore } from "@/store/ui-store";
import { MessageFull } from "./chat-schemas";

const uiStore = useUiStore();
const newMsg = ref("");
const list = ref<MessageFull[]>([]);

onBeforeUnmount(
  client.chat.onNewMessage.subscribe(undefined, {
    onData: (payload) => {
      console.log(payload);
      list.value.push(payload);
    },
    onError(err) {
      uiStore.notify(err.message ?? "Error");
    },
  }).unsubscribe,
);

getMsgs();

async function addMsg() {
  if (!newMsg.value.trim().length) return;

  await client.chat.sendMessage.mutate({ message: newMsg.value }).then(() => {
    newMsg.value = "";
  });
}

async function getMsgs() {
  client.chat.getMessages.query({}).then((data) => {
    if (data) list.value = data;
  });
}
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl mb-8">Chat room</h1>
    <form @submit.prevent="addMsg">
      <label for="new-message">New message</label>
      <fieldset role="group">
        <input class="input" v-model="newMsg" type="text" />
        <input class="btn btn-neutral" type="submit" value="Add" />
      </fieldset>
    </form>

    <div class="divider"></div>

    <ul class="p-4">
      <li v-for="todo in list" :key="todo.id" class="list-disc">
        {{ todo.sender.name || "--" }}: {{ todo.message }}
      </li>
    </ul>
  </div>
</template>
