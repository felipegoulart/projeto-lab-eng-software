<template>
  <q-page padding class="container spaced">
    <q-scroll-area v-if="board" style="height: calc(100vh - 82px); max-width: 100vw">
      <div class="row no-wrap q-gutter-x-lg">
        <section v-for="(status, index) in board.status" :key="index">
          <header class="q-mb-md">
            <div style="padding: 16px; text-align: left; color:white; background-color: red">
              {{ status.name }}
            </div>
          </header>

          <q-scroll-area class="columns" style="height: calc(100vh - 182px); width: 264px;">
            <q-card style="margin-bottom: 8px; width: 250px" v-for="(tasks, index) in board.tasks" :key="index">
              <q-card-section>
                {{tasks.title}}
              </q-card-section>

              <q-card-section>
                {{ tasks.description}}
              </q-card-section>
            </q-card>
          </q-scroll-area>
        </section>
      </div>
    </q-scroll-area>
  </q-page>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBoardsStore } from 'stores/boards'

const boardsStore = useBoardsStore()
const route = useRoute()
const board = ref()

onMounted(async () => {
  board.value = await boardsStore.getSingleBoard(route.params?.uuid as string)
})

watch(() => route.params, async () => {
  if (route.params?.uuid) {
    board.value = await boardsStore.getSingleBoard(boardsStore.currentBoardUUID)
  }
})

</script>
