import { Request } from 'express'
import { 
  list,
  create as createBoards,
  show as showBoards,
  update as updateBoards,
  remove as removeBoards
} from 'repositories/boardsRepository'

async function index () {
  const results = await list()
  return results
}

async function create (req: Request) {
  const { name } = req.body

  if (!name) throw new Error('Name is required')

  return await createBoards(name)
}

async function show (req: Request) {
  const { uuid } = req.params

  if (!uuid) throw new Error('Uuid is required')

  const result = await showBoards(uuid)
  
  return result
}

async function update (req: Request) {
  const {
    body,
    params: { uuid }
  } = req

  if (!uuid) throw new Error('UUID is required')

  const result = await updateBoards(uuid, body.name)

  return result
}

function remove (req: Request) {
  const { uuid } = req.params

  if (!uuid) throw new Error('UUID is required')

  removeBoards(uuid)
}

export {
  index,
  create,
  show,
  update,
  remove
}
