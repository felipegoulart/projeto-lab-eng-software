<template>
  <q-layout view="lHh lpR lFf">
    <q-header elevated class="text-white">
      <q-toolbar>
        <q-toolbar-title>
          {{ pageTitle }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBoardsStore } from 'stores/boards'

const systemName = 'Kanbam'

const boardsStore = useBoardsStore()
const pageTitle = computed(() => boardsStore.getBoardByUUID?.name || systemName)
</script>
