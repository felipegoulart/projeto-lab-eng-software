<template>
  <q-page class="container spaced" :padding="true">
    <header class="row q-px-md justify-between">
      <h1 class="text-h4">Listagem de quadros</h1>
      <q-btn color="primary" icon="add" label="Novo quadro" @click="showDialog= true"/>
    </header>

    <main class="q-pa-md">
      <q-table
        :columns="columns"
        :filter="filter"
        hide-header
        hide-no-data
        :rows-per-page-options="[10]"
        rows-per-page-label="Quadros por página"
        :pagination-label="(first, last, total) => `${first}-${last} de ${total}`"
        :pagination="paginationProps"
        grid
        no-results-label="Nenhum resultado encontrado"
        row-key="name"
        :rows="boardsStore.boards"
        @row-click="goToBoard"
      >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="pesquisar">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
    </main>
  </q-page>

  <q-dialog
    v-model="showDialog"
  >
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">Novo quadro</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input ref="boardNameInput" v-model="boardName" label="Nome do quadro" :rules="[value => value.length || 'Campo obrigatório']" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat color="negative" label="Cancelar" v-close-popup />
        <q-btn color="primary" label="Criar" :loading="loadingButton" @click="createBoard" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { QInput, QTableProps } from 'quasar'
import { useRouter } from 'vue-router'
import { useBoardsStore } from 'stores/boards'

const boardsStore = useBoardsStore()
const router = useRouter()

onMounted(async () => {
  await boardsStore.getBoards()
})

const loadingButton = ref(false)
const filter = ref('')
const showDialog = ref(false)
const boardName = ref('')
const boardNameInput = ref<InstanceType<typeof QInput>>()

const paginationProps = {
  rowsPerPage: 10
}

async function createBoard () {
  if (!boardNameInput?.value?.validate()) return

  loadingButton.value = true
  try {
    await boardsStore.createBoard(boardName.value)
    await boardsStore.getBoards()
  } catch (error) {
    console.error(error)
  } finally {
    loadingButton.value = false
    showDialog.value = false
    boardName.value = ''
  }
}

function goToBoard (_: Event, row: any) {
  router.push({ name: 'BoardsSingle', params: { uuid: row.uuid } })
}

const columns: QTableProps['columns'] = [
  {
    name: 'name',
    required: true,
    label: 'Nome',
    align: 'left',
    field: 'name',
    sortable: true
  },
  {
    name: 'tasks_count',
    align: 'left',
    label: 'Quantidade de tarefas',
    field: 'tasks_count',
    sortable: true
  }
]
</script>
