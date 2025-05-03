<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { type OwnTodo } from "@/todo/todo-schemas";
import { XIcon } from "lucide-vue-next";
import { client } from "@/rpc/rpc-client";
import { useUiStore } from "@/store/ui-store";

const uiStore = useUiStore();
const newTodo = ref("");
const list = ref<OwnTodo[]>([]);

getTodos();

const updateSub = client.todo.onTodoUpdates.subscribe(undefined, {
  onData: ([key, payload]) => {
    if (key === "create") {
      list.value.push(payload);
    } else if (key === "delete") {
      list.value = list.value.filter((todo) => todo.id !== payload);
    }
  },
  onError(err) {
    uiStore.notify(err.message ?? "Error");
  },
});

onBeforeUnmount(updateSub.unsubscribe);

function getTodos() {
  client.todo.listTodos.query().then((data) => {
    if (data) list.value = data;
  });
}

async function addTodo() {
  if (!newTodo.value.trim().length) return;

  await client.todo.createTodo.mutate({ title: newTodo.value }).then(() => {
    newTodo.value = "";
  });
}

function removeTodo(id: string) {
  client.todo.deleteTodo
    .mutate({ id })
    .then(() => {
      list.value = list.value.filter((todo) => todo.id !== id);
    })
    .catch((error) => {
      uiStore.notify(error.message ?? "Error deleting todo", {
        kind: "error",
      });
    });
}
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl mb-8">To Do List</h1>
    <form @submit.prevent="addTodo">
      <label for="new-todo">New todo</label>
      <fieldset role="group">
        <input class="input" v-model="newTodo" type="text" />
        <input class="btn btn-neutral" type="submit" value="Add" />
      </fieldset>
    </form>

    <div class="divider"></div>

    <ul class="p-4">
      <li v-for="todo in list" :key="todo.id" class="list-disc">
        {{ todo.title }}
        <button
          @click="() => removeTodo(todo.id)"
          class="btn btn-neutral btn-xs btn-circle ml-2"
        >
          <XIcon :size="16" :stroke-width="3" />
        </button>
      </li>
    </ul>
  </div>
</template>
