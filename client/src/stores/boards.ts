import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import boardInteface from 'src/types/boards'

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
      console.log(data)
      return data
    },

    setCurrentBoardUUID (uuid: string|string[]) {
      this.currentBoardUUID = Array.isArray(uuid) ? uuid[0] : uuid
    }
  }
})
