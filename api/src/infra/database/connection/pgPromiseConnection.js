import dotenv from 'dotenv'
import pgPromise from 'pg-promise'

dotenv.config()

const connectionOptions = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || '5432',
  database: process.env.POSTGRES_DATABASE || 'scrum',
  user: process.env.POSTGRES_USER || 'user',
  password: process.env.POSTGRES_PASSWORD || 'secret'
}

export default pgPromise()(connectionOptions)
