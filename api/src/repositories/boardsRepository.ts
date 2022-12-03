import database from 'database/connection/pgPromiseConnection'
import IStatus from 'model/StatusModel'
import { create as createStatus, listStatusByBoard } from 'repositories/statusRepository'
import { listTasksByStatus } from 'repositories/tasksRepository'

async function list () {
  try {
    const boards = await database.query(`
      SELECT
        boards.uuid,
        boards.name,
        boards.created_at,
        boards.updated_at,
        count(tasks.board_uuid) as tasks_count
      FROM
        boards
        LEFT JOIN tasks ON boards.uuid = tasks.board_uuid
      GROUP BY
        boards.uuid 
    `)
  
    return boards
  } catch (error) {
    console.error(error)
  }
}

async function create (name: string)  {
  try {
    const result = await database.one('INSERT INTO boards (name) VALUES ($1) RETURNING *', [name])
    await createStatus('Backlog', result.uuid)

    return await show(result.uuid)
  } catch (error) {
    console.error(error)
  }

}

async function show (uuid: string) {
  try {
    const board = await database.oneOrNone(`
      SELECT 
        *
      FROM boards
      WHERE uuid = $1`, 
      [uuid]
    )
  
    const statusData = await listStatusByBoard(uuid)
    const statusList: IStatus[] = []

    for (const status of statusData) {
      const tasks = await listTasksByStatus(status.uuid)
      
      status.tasks = tasks
      
      statusList.push(status)
    }
    
    board.status = statusList
  
    return board
  } catch (error) {
    console.error(error)
  }
}

function update (uuid: string, name: string) {
  try {
    return database
      .oneOrNone(
        'UPDATE boards SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE uuid = $2 RETURNING *',
        [name, uuid]
      )
  } catch (error) {
    console.error(error)
  }
}

function remove (uuid: string) {
  try {
    database.query('DELETE FROM boards WHERE uuid = $1', [uuid])
  } catch (error) {
    console.error(error)
  }
}

export {
  list,
  create,
  show,
  update,
  remove
}