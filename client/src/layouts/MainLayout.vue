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
import { watch, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBoardsStore } from 'stores/boards'

const boardsStore = useBoardsStore()
const router = useRoute()

onMounted(async () => {
  await boardsStore.getBoards()
})

const systemName = 'Kanbam'
const pageTitle = computed(() => boardsStore.getBoardByUUID?.name || systemName)

watch(() => router.path, () => {
  const boardUUID = router.params?.uuid
  boardsStore.boards.length && boardsStore.setCurrentBoardUUID(boardUUID)
})

</script>
