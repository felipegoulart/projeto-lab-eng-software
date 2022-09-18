// import { formatTimestamp } from 'helpers/date'
import { Request } from 'express'
import connection from 'infra/database/connection/pgPromiseConnection.js'

async function index () {
  const results = await connection.query('SELECT * FROM squads')
  return results
}

async function create (req: Request) {
  const { name } = req.body

  if (!name) throw new Error('Name is required')

  const result = await connection.query('INSERT INTO squads (name) VALUES ($1) RETURNING *', [name])

  return result
}

async function show (req: Request) {
  const result = await connection.query('SELECT * FROM squads WHERE uuid = $1', [req.params.uuid])

  return result
}

async function update (req: Request) {
  const {
    body,
    params: { uuid }
  } = req

  if (!uuid) throw new Error('UUID is required')

  const result = await connection.query('UPDATE squads SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE uuid = $2 RETURNING *',
    [body.name, uuid]
  )

  return result
}

async function remove (req: Request) {
  const { uuid } = req.params

  if (!uuid) throw new Error('UUID is required')

  try {
    await connection.query('DELETE FROM squads WHERE uuid = $1', [uuid])
  } catch (error: any) {
    throw new Error(error)
  }
}

export {
  index,
  create,
  show,
  update,
  remove
}
