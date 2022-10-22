import database from 'database/connection/pgPromiseConnection'

function list () {
  return database.query('SELECT * FROM tasks')
}

function listTasksByBoard (boardUUID: string) {
  return database.query('SELECT uuid, title FROM tasks WHERE board_uuid = $1', [boardUUID])
}

function create (name: string, description: string, boardUUID: string, statusUUID: string)  {
  return database.query('INSERT INTO tasks (title, description, board_uuid, status_uuid) VALUES ($1, $2, $3, $4) RETURNING *', [name, description, boardUUID, statusUUID])
}

function update (uuid: string, title: string) {
  return database
    .query(
      'UPDATE tasks SET title = $1, updated_at = CURRENT_TIMESTAMP WHERE uuid = $2 RETURNING *',
      [title, uuid]
    )
}

function remove (uuid: string) {
  database.query('DELETE FROM tasks WHERE uuid = $1', [uuid])
}

export {
  list,
  listTasksByBoard,
  create,
  update,
  remove
}