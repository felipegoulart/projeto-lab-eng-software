import ITask from "./TasksModel"

export default interface IStatus {
  uuid: string
  name: string
  tasks: ITask[]
  boardUUID: string
  createdAt: string
  updatedAt: string 
}
