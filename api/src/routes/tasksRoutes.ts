import { Router } from 'express'
import { index, create, update, remove } from 'controllers/tasksController'

const router = Router()

router.get('', async (req, res) => {
  const results = await index()

  res.json({ results })
})

router.post('', async (req, res) => {
  const result = await create(req)

  res.json(result)
})

router.put('/:uuid', async (req, res) => {
  const result = await update(req)

  res.json(result)
})

router.delete('/:uuid', async (req, res) => {
  remove(req)

  res.status(200).json({ message: 'The item was sucessfully deleted' })
})

export default router
