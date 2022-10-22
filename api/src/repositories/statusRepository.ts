import database from 'database/connection/pgPromiseConnection'

function list () {
  return database.query('SELECT * FROM status')
}

function listStatusByBoard (boardUUID: string) {
  return database.query('SELECT uuid, name FROM status WHERE board_uuid = $1', [boardUUID])
}

function create (name: string, boardUUID: string)  {
  return database.query('INSERT INTO status (name, board_uuid) VALUES ($1, $2) RETURNING *', [name, boardUUID])
}

function update (uuid: string, name: string) {
  return database
    .query(
      'UPDATE status SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE uuid = $2 RETURNING *',
      [name, uuid]
    )
}

function remove (uuid: string) {
  database.query('DELETE FROM status WHERE uuid = $1', [uuid])
}

export {
  list,
  listStatusByBoard,
  create,
  update,
  remove
}