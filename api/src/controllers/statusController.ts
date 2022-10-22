import { 
  list,
  create as createStatus,
  update as updateStatus,
  remove as removeStatus
} from 'repositories/statusRepository'
import { Request } from 'express'

async function index () {
  const results = await list()
  return results
}

async function create (req: Request) {
  const { name, boardUUID } = req.body

  if (!name) throw new Error('Name is required')

  if (!boardUUID) throw new Error('Board is required')

  const result = await createStatus(name, boardUUID)

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
