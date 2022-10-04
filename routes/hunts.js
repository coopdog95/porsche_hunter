var express = require('express')
var router = express.Router()
const {
  getAllHunts,
  createNewHunt,
  findById,
  updateHunt,
  deleteHunt,
} = require('../models/hunt')
const { verifyToken } = require('../models/user')

router.get('/', async (req, res, next) => {
  const hunts = await getAllHunts()
  res.json(hunts)
})

router.get('/:huntId', async (req, res, next) => {
  const { huntId } = req.params
  const hunt = await findById(huntId)
  if (!hunt) {
    res.status(401).json({
      error: `No hunt with id ${huntId} found`,
    })
  } else {
    res.json(hunt)
  }
})

// make sure user_id being passed here somehow...
router.post('/', async (req, res, next) => {
  const userId = verifyToken(req)
  const { huntProps, cars } = req.body
  try {
    const newHunt = await createNewHunt(userId, huntProps, cars)
    console.log('newHunt', newHunt)
    res.status(201).json(newHunt)
  } catch (error) {
    res.status(401).json({
      error: `Hunt could not be created: ${error}`,
    })
  }
})

router.patch('/:huntId', async (req, res, next) => {
  const { huntId } = req.params
  const { huntProps, cars } = req.body
  try {
    const updatedHunt = await updateHunt(huntId, huntProps, cars)
    res.status(200).json(updatedHunt)
  } catch (error) {
    res.status(401).json({
      error: 'Error updating hunt',
    })
  }
})

router.delete('/:huntId', async (req, res) => {
  const { huntId } = req.params
  try {
    await deleteHunt(huntId)
    res.status(200).json({ message: `Hunt ${huntId} deleted` })
  } catch (error) {
    res.status(401).json({
      error: 'Error deleting hunt',
    })
  }
})

module.exports = router
