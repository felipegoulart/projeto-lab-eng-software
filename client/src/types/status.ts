import ITask from './tasks'

export default interface IStatus {
  uuid: string
  name: string
  tasks: ITask[]
  boardUUID: string
  createdAt: string
  updatedAt: string
}
