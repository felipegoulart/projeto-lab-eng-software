import dotenv from 'dotenv'
import pgPromise from 'pg-promise' 

dotenv.config()

const connectionURL: string =  process.env.POSTGRES_URL || 'postgres://user:secret@postgres_db:5432/scrum?schema=public'

export default pgPromise()(connectionURL)
