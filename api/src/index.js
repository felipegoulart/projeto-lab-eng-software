import express from 'express'

const app = express()
const PORT = 3000

app.get('/', (req, res) => res.json({message: 'Rodando'}))

app.listen(PORT, () => console.log(`App running on port: ${PORT}`))