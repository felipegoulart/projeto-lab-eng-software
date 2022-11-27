import { 
  list,
  create as createTask,
  update as updateTask,
  remove as removeTask,
  updateStatus as updateStatusRepository
} from 'repositories/tasksRepository'
import { Request } from 'express'

async function index () {
  return await list()
}

async function create (req: Request) {
  const { title, description, boardUUID, statusUUID } = req.body

  if (!title) throw new Error('Title is required')

  if (!boardUUID) throw new Error('Board is required')

  if (!statusUUID) throw new Error('Status is required')

  const result = await createTask(title, description, boardUUID, statusUUID)

  return result
}

async function update (req: Request) {
  const {
    body,
    params: { uuid }
  } = req

  if (!uuid) throw new Error('UUID is required')

  const result = await updateTask(uuid, body.name)

  return result
}

async function updateStatus (req: Request) {
  const {
    body,
    params: { uuid }
  } = req

  if (!uuid) throw new Error('UUID is required')

  const result = await updateStatusRepository(uuid, body.statusUUID)

  return result
}

function remove (req: Request) {
  const { uuid } = req.params

  if (!uuid) throw new Error('UUID is required')

  removeTask(uuid)
}

export {
  index,
  create,
  update,
  updateStatus,
  remove
}
