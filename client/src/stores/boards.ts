import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import boardInteface from 'src/types/boards'
import ITask from 'src/types/tasks'

export const useBoardsStore = defineStore('boards', {
  state: () => ({
    boards: <boardInteface[]> [],
    currentBoardUUID: ''
  }),

  getters: {
    getBoardByUUID: (state): boardInteface|undefined => state.boards.find((item: boardInteface) => item.uuid === state.currentBoardUUID)
  },

  actions: {
    async getBoards () {
      const { data } = await api.get('boards')
      this.boards = data
    },

    async getSingleBoard (uuid: string): Promise<boardInteface> {
      const { data } = await api.get(`boards/${uuid}`)

      return data
    },

    setCurrentBoardUUID (uuid: string|string[]) {
      this.currentBoardUUID = Array.isArray(uuid) ? uuid[0] : uuid
    },

    async createBoard (name: string): Promise<void> {
      await api.post('boards', { name })
    },

    async createStatus (name: string, boardUUID: string): Promise<void> {
      await api.post('status', { name, boardUUID })
    },

    async createTask (title: string, description: string, statusUUID: string, boardUUID: string): Promise<void> {
      await api.post('tasks', { title, description, statusUUID, boardUUID })
    },

    async updateTask ({ uuid, title, description, timeEstimate, statusUUID }: ITask): Promise<void> {
      await api.put(`tasks/${uuid}`, { title, description, timeEstimate, statusUUID })
    }

  }
})
