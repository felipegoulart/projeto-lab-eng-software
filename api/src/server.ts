import express from 'express'
import squadsRouter from './routes/squadsRoutes'

const app = express()

app.use(express.json())

/* Rotas */
app.use('/squads', squadsRouter)

export default app
