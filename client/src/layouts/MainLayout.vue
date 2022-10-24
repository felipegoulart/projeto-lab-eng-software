<template>
  <q-layout view="lHh lpR lFf">
    <q-header elevated class="text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          {{ pageTitle }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer side="left" v-model="leftDrawerOpen" behavior="desktop" :width="200">
      <q-list class="full-width column">
        <q-item
          v-for="(item, index) in boardsStore.boards"
          active-class="q-router-link--active"
          class="row"
          :key="index"
          :to="{ name: 'BoardsSingle', params: {uuid: item.uuid}}"
        >
        <q-item-section>
          {{item.name}}
        </q-item-section>

        <q-avatar>
          <q-badge>{{item.tasks_count}}</q-badge>
        </q-avatar>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
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

const leftDrawerOpen = ref(false)
function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

</script>
