import { 
  list,
  create as createSquad,
  show as showSquad,
  update as updateSquad,
  remove as removeSquad
} from 'repositories/squadsRepository'
import { Request } from 'express'

async function index () {
  const results = await list()
  return results
}

async function create (req: Request) {
  const { name } = req.body

  if (!name) throw new Error('Name is required')

  const result = await createSquad(name)

  return result
}

async function show (req: Request) {
  const { uuid } = req.params

  if (!uuid) {
    throw new Error('UUID is required')
  }

  const result = await showSquad(uuid)

  return result
}

async function update (req: Request) {
  const {
    body,
    params: { uuid }
  } = req

  if (!uuid) throw new Error('UUID is required')

  const result = await updateSquad(uuid, body.name)

  return result
}

function remove (req: Request) {
  const { uuid } = req.params

  if (!uuid) throw new Error('UUID is required')

  removeSquad(uuid)
}

export {
  index,
  create,
  show,
  update,
  remove
}
