import database from 'database/connection/pgPromiseConnection'
import { create as createStatus, listStatusByBoard } from 'repositories/statusRepository'
import { listTasksByBoard } from 'repositories/tasksRepository'

async function list () {
  const boards = await database.query(`
    SELECT
      boards.uuid,
      boards.name,
      boards.created_at,
      boards.updated_at,
      count(tasks.board_uuid) as tasks_count
    FROM
      boards
      INNER JOIN tasks ON boards.uuid = tasks.board_uuid
    GROUP BY
      boards.uuid 
  `)

  return boards
}

async function create (name: string)  {
  const result = await database.one('INSERT INTO boards (name) VALUES ($1) RETURNING *', [name])

  try {
    await createStatus('Backlog', result.uuid)
  } catch (error) {
    console.error(error)
  }

  return await show(result.uuid)
}

async function show (uuid: string) {
  const board = await database.oneOrNone(`
    SELECT 
      *
    FROM boards
    WHERE uuid = $1`, 
    [uuid]
  )

  const status = await listStatusByBoard(uuid)
  const tasks = await listTasksByBoard(uuid)
  
  board.status = status
  board.tasks = tasks

  return board
}

function update (uuid: string, name: string) {
  return database
    .oneOrNone(
      'UPDATE boards SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE uuid = $2 RETURNING *',
      [name, uuid]
    )
}

function remove (uuid: string) {
  database.query('DELETE FROM boards WHERE uuid = $1', [uuid])
}

export {
  list,
  create,
  show,
  update,
  remove
}