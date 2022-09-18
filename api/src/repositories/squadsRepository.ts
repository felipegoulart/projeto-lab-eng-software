import database from 'database/connection/pgPromiseConnection'

function list () {
  return database.query('SELECT * FROM squads')
}

function create (name: string)  {
  return database.query('INSERT INTO squads (name) VALUES ($1) RETURNING *', [name])
}

function show (uuid: string) {
  return database.query('SELECT * FROM squads WHERE uuid = $1', [uuid])
}

function update (uuid: string, name: string) {
  return database
    .query(
      'UPDATE squads SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE uuid = $2 RETURNING *',
      [name, uuid]
    )
}

function remove (uuid: string) {
  database.query('DELETE FROM squads WHERE uuid = $1', [uuid])
}

export {
  list,
  create,
  show,
  update,
  remove
}