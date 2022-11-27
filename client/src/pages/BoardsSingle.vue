<template>
  <q-page padding class="container spaced">
    <header class="row q-px-md q-pb-md justify-between">
      <h1 class="text-h4">{{ board?.name }}</h1>
      <q-btn color="primary" icon="add" label="Novo status" @click="showDialog= true"/>
    </header>

    <q-scroll-area v-if="board" style="height: calc(100vh - 82px); max-width: 100vw">
      <div class="row no-wrap q-gutter-x-lg">
        <section v-for="(status, index) in board.status" :key="index">
          <header class="col q-mb-md">
            <div style="padding: 16px; text-align: left; color:white; background-color: #1976D2">
              {{ status.name }}
            </div>

            <div>
              <q-btn class="full-width" flat color="primary" icon="add" label="Nova tarefa" @click="openTaskDialog(status.uuid)"/>
            </div>
          </header>

          <q-scroll-area class="columns" style="height: calc(100vh - 182px); width: 264px;">
            <template v-if="tasksByStatusUUID[status.uuid]">
              <q-card style="margin-bottom: 8px; width: 250px" v-for="(task, index) in tasksByStatusUUID[status.uuid]" :key="index">
                <q-card-section>
                  {{task.title}}
                </q-card-section>

                <q-card-section>
                  {{ task.description}}
                </q-card-section>

                <q-card-section>
                  <q-btn class="full-width" color="primary" icon="add" label="Alterar status" @click="openChangeStatusDialog(task)"/>
                </q-card-section>
            </q-card>
          </template>
          </q-scroll-area>
        </section>
      </div>
    </q-scroll-area>
  </q-page>

  <q-dialog v-model="showDialog">
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">Novo quadro</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input ref="statusNameInput" v-model="statusName" label="Nome do status" :rules="[value => value.length || 'Campo obrigatório']" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat color="negative" label="Cancelar" v-close-popup />
        <q-btn color="primary" label="Criar" :loading="loadingButton" @click="newStatus" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showTaskDialog">
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">Nova tarefa</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input ref="taskNameInput" v-model="taskName" label="Nome da tarefa" :rules="[value => value.length || 'Campo obrigatório']" />
        <q-input v-model="taskDescription" label="Descrição" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat color="negative" label="Cancelar" v-close-popup />
        <q-btn color="primary" label="Criar" :loading="loadingButton" @click="newTask" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showChangeTaskStatusDialog">
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">Alterar status da tarefa</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-select v-model="selectedTaskStatus" emit-value map-options :options="statusOptions" label="Selecione um status" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat color="negative" label="Cancelar" v-close-popup />
        <q-btn color="primary" label="Alterar" @click="updateTaskStatus" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBoardsStore } from 'stores/boards'

const boardsStore = useBoardsStore()
const route = useRoute()
const board = ref()

const showDialog = ref(false)
const showTaskDialog = ref(false)
const loadingButton = ref(false)
const statusName = ref('')
const taskName = ref('')
const taskDescription = ref('')
const statusNameInput = ref(null)
const taskNameInput = ref(null)
const currentStatusUUID = ref('')
const selectedTaskStatus = ref('')

async function newStatus () {
  if (!statusNameInput?.value?.validate()) return

  loadingButton.value = true
  try {
    await boardsStore.createStatus(statusName.value, board.value.uuid)
    board.value = await boardsStore.getSingleBoard(route.params?.uuid as string)
  } catch (error) {
    console.error(error)
  } finally {
    loadingButton.value = false
    showDialog.value = false
    statusName.value = ''
  }
}

function openTaskDialog (status: string) {
  showTaskDialog.value = true
  currentStatusUUID.value = status
}

async function newTask () {
  if (!taskNameInput?.value?.validate()) return

  loadingButton.value = true
  try {
    await boardsStore.createTask(taskName.value, taskDescription.value, currentStatusUUID.value, board.value.uuid)
    taskDescription.value = ''
    taskName.value = ''
    board.value = await boardsStore.getSingleBoard(route.params?.uuid as string)
  } catch (error) {
    console.error(error)
  } finally {
    showTaskDialog.value = false
  }
}

async function updateTaskStatus () {
  if (!taskNameInput?.value?.validate()) return

  loadingButton.value = true
  try {
    await boardsStore.updateTaskStatus(taskForChangeStatusUUID.value, selectedTaskStatus.value)
    board.value = await boardsStore.getSingleBoard(route.params?.uuid as string)
  } catch (error) {
    console.error(error)
  } finally {
    showTaskDialog.value = false
  }
}

const taskForChangeStatusUUID = ref('')
const showChangeTaskStatusDialog = ref(false)

function openChangeStatusDialog (task: any) {
  showChangeTaskStatusDialog.value = true
  taskForChangeStatusUUID.value = task.uuid
  selectedTaskStatus.value = task.status_uuid
}

const tasksByStatusUUID = computed(() => {
  const status = board.value?.tasks.map((task: any) => task.status_uuid)
  const tasksByStatus = {}
  status.forEach((status: string) => {
    tasksByStatus[status] = board?.value.tasks.filter((task: any) => task.status_uuid === status)
  })

  return tasksByStatus
})

const statusOptions = computed(() => {
  return board.value?.status.map((status: any) => {
    return {
      label: status.name,
      value: status.uuid
    }
  }) || []
})

onMounted(async () => {
  board.value = await boardsStore.getSingleBoard(route.params?.uuid as string)
})

watch(() => route.params, async () => {
  if (route.params?.uuid) {
    board.value = await boardsStore.getSingleBoard(boardsStore.currentBoardUUID)
  }
})

</script>
