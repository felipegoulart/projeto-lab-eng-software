import database from 'database/connection/pgPromiseConnection'
import ITask from 'model/TasksModel'

function list () {
  return database.query('SELECT * FROM tasks')
}

async function listTasksByStatus (statusUUID: string): Promise<ITask[]> {
  const result =  await database.query('SELECT uuid, title, description, status_uuid, created_at, updated_at FROM tasks WHERE status_uuid = $1', [statusUUID])
  return result.map((task: any) => ({
    uuid: task.uuid,
    title: task.title,
    description: task.description,
    statusUUID: task['status_uuid'],
    createdAt: task['created_at'],
    updatedAt: task['updated_at'],
  }))
}

function create (name: string, description: string, boardUUID: string, statusUUID: string)  {
  return database.query('INSERT INTO tasks (title, description, board_uuid, status_uuid) VALUES ($1, $2, $3, $4) RETURNING *', [name, description, boardUUID, statusUUID])
}

function update ({uuid, title, description, timeEstimate, statusUUID}: ITask) {
  return database
    .query(
      'UPDATE tasks SET title = $1, description = $2, time_estimate = $3, status_uuid = $4, updated_at = CURRENT_TIMESTAMP WHERE uuid = $5 RETURNING *',
      [title, description, timeEstimate, statusUUID, uuid]
    )
}

function updateStatus (uuid: string, statusUUID: string) {
  return database
    .query(
      'UPDATE tasks SET status_uuid = $1, updated_at = CURRENT_TIMESTAMP WHERE uuid = $2 RETURNING *',
      [statusUUID, uuid]
    )
}

function remove (uuid: string) {
  database.query('DELETE FROM tasks WHERE uuid = $1', [uuid])
}

export {
  list,
  listTasksByStatus,
  create,
  update,
  updateStatus,
  remove
}