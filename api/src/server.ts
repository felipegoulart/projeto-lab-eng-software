import express from 'express'
import cors from 'cors'

import boardsRoutes from 'routes/boardsRoutes'
import statusRoutes from 'routes/statusRoutes'
import tasksRoutes from 'routes/tasksRoutes'

const app = express()

app.use(cors())
app.use(express.json())

/* Rotas */
app.use('/boards', boardsRoutes)
app.use('/status', statusRoutes)
app.use('/tasks', tasksRoutes)

export default app
