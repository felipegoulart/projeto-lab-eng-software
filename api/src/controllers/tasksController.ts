import { 
  list,
  create as createStatus,
  update as updateStatus,
  remove as removeStatus
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

  const result = await createStatus(title, description, boardUUID, statusUUID)

  return result
}

async function update (req: Request) {
  const {
    body,
    params: { uuid }
  } = req

  if (!uuid) throw new Error('UUID is required')

  const result = await updateStatus(uuid, body.name)

  return result
}

function remove (req: Request) {
  const { uuid } = req.params

  if (!uuid) throw new Error('UUID is required')

  removeStatus(uuid)
}

export {
  index,
  create,
  update,
  remove
}
