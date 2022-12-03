<template>
  <q-page
    padding
    class="container spaced"
  >
    <header class="column q-gutter-y-xs q-mb-md">
      <div class="row q-px-md justify-between">
        <h1 class="text-h4">{{ board?.name }}</h1>
        <q-btn
          color="primary"
          icon="add"
          label="Novo status"
          @click="showStatusDialog = true"
        />
      </div>

      <q-breadcrumbs>
        <q-breadcrumbs-el label="Listagem" to="/" />
        <q-breadcrumbs-el label="Quadro" />
      </q-breadcrumbs>
    </header>

    <q-scroll-area
      v-if="board"
      style="height: calc(100vh - 170px); max-width: 100vw"
    >
      <div class="row no-wrap q-gutter-x-lg">
        <section
          v-for="(status, index) in board.status"
          :key="index"
        >
          <header class="col q-mb-md">
            <div
              style="padding: 16px; text-align: left; color:white; background-color: #1976D2"
            >
              {{ status.name }}
            </div>

            <div>
              <q-btn
                class="full-width"
                flat color="primary"
                icon="add"
                label="Nova tarefa"
                @click="openCreateTaskDialog(status.uuid)"
              />
            </div>
          </header>

          <q-scroll-area
            class="columns"
            style="height: calc(100vh - 300px); width: 264px;"
          >
            <q-card
              v-for="(task, index) in status.tasks"
              style="margin-bottom: 8px; width: 250px"
              :key="index"
            >
              <q-card-section>
                <div class="columns q-gutter-y-sm">
                  <div class="text-weight-bold">
                    {{ task.title }}
                  </div>

                  <div>
                    {{ task.description }}
                  </div>

                  <q-btn
                    class="full-width q-mt-md"
                    color="primary"
                    icon="edit"
                    label="Editar tarefa"
                    @click="openEditTaskDialog(task)"
                  />
                </div>
              </q-card-section>
            </q-card>
          </q-scroll-area>
        </section>
      </div>
    </q-scroll-area>
  </q-page>

  <q-dialog v-model="showStatusDialog">
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">Novo status</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          ref="statusNameInput"
          v-model="statusName"
          label="Nome do status"
          :rules="[value => value.length || 'Campo obrigatório']"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          color="negative"
          label="Cancelar"
          v-close-popup
        />
        <q-btn
          color="primary"
          label="Criar"
          @click="createStatus"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="showTaskDialog">
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">{{ taskDialogTitle }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none column">
        <q-input
          ref="taskNameInput"
          v-model="taskValues.title"
          label="Nome da tarefa"
          :rules="[value => value.length || 'Campo obrigatório']"
        />

        <q-input
          v-model="taskValues.description"
          class="q-mb-md"
          label="Descrição"
        />

        <q-select
          v-model="taskValues.statusUUID"
          emit-value
          map-options
          :options="statusOptions"
          label="Selecione um status"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          color="negative"
          label="Cancelar"
          v-close-popup
        />
        <q-btn
          color="primary"
          :label="taskSubmitButtonLabel"
          @click="handleSubmitTask"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed, reactive } from 'vue'
import { QInput } from 'quasar'
import { useRoute } from 'vue-router'
import { useBoardsStore } from 'stores/boards'
import ITask from '../types/tasks'
import IStatus from '../types/status'

const route = useRoute()

const boardsStore = useBoardsStore()
const board = ref()

onMounted(async () => {
  board.value = await boardsStore.getSingleBoard(route.params?.uuid as string)
})

watch(() => route.params, async () => {
  if (route.params?.uuid) {
    board.value = await boardsStore.getSingleBoard(boardsStore.currentBoardUUID)
  }
})

const showStatusDialog = ref(false)
const statusName = ref('')
const statusNameInput = ref<InstanceType<typeof QInput>>()

const statusOptions = computed(() => {
  return board.value?.status.map((status: IStatus) => {
    return {
      label: status.name,
      value: status.uuid
    }
  }) || []
})

async function createStatus () {
  if (!statusNameInput?.value?.validate()) return

  try {
    await boardsStore.createStatus(statusName.value, board.value.uuid)
    board.value = await boardsStore.getSingleBoard(route.params?.uuid as string)
  } catch (error) {
    console.error(error)
  } finally {
    showStatusDialog.value = false
    statusName.value = ''
  }
}

const showTaskDialog = ref(false)
const submitTaskMode = ref<'create' | 'update'>('create')
const taskDialogTitle = ref<'Nova tarefa' | 'Editar tarefa'>('Nova tarefa')
const taskSubmitButtonLabel = ref<'Criar' | 'Editar'>('Criar')
const taskValues = reactive<ITask>({ title: '', description: '', statusUUID: '' })
const taskNameInput = ref<InstanceType<typeof QInput>>()

function handleSubmitTask () {
  submitTaskMode.value === 'create' ? createTask() : updateTask()
}

function handleTaskDialogType (isEditMode = false) {
  if (isEditMode) {
    submitTaskMode.value = 'update'
    taskDialogTitle.value = 'Editar tarefa'
    taskSubmitButtonLabel.value = 'Editar'
    return
  }

  submitTaskMode.value = 'create'
  taskDialogTitle.value = 'Nova tarefa'
  taskSubmitButtonLabel.value = 'Criar'
}

function openEditTaskDialog (task: ITask) {
  handleTaskDialogType(true)
  showTaskDialog.value = true
  Object.assign(taskValues, task)
}

function openCreateTaskDialog (statusUUID: string) {
  handleTaskDialogType()
  showTaskDialog.value = true
  taskValues.statusUUID = statusUUID
}

async function createTask () {
  if (!taskNameInput?.value?.validate()) return

  try {
    await boardsStore.createTask(taskValues.title, taskValues.description, taskValues.statusUUID, board.value.uuid)
    resetTaskValues()
    board.value = await boardsStore.getSingleBoard(route.params?.uuid as string)
  } catch (error) {
    console.error(error)
  } finally {
    showTaskDialog.value = false
  }
}

async function updateTask () {
  try {
    await boardsStore.updateTask(taskValues)
    board.value = await boardsStore.getSingleBoard(route.params?.uuid as string)
    resetTaskValues()
  } catch (error) {
    console.error(error)
  } finally {
    showTaskDialog.value = false
  }
}

function resetTaskValues () {
  taskValues.title = ''
  taskValues.description = ''
  taskValues.statusUUID = ''
}
</script>
