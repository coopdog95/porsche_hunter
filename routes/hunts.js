var express = require('express')
var router = express.Router()
const {
  getAllHunts,
  createNewHunt,
  findById,
  updateHunt,
} = require('../models/hunt')

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
  const { huntProps, cars } = req.body
  try {
    const { hunt, cars: createdCars } = await createNewHunt(huntProps, cars)
    res.status(201).json({ hunt, cars: createdCars })
  } catch (error) {
    res.status(401).json({
      error: `Hunt could not be created: ${error}`,
    })
  }
})

router.patch('/:huntId', async (req, res, next) => {
  const { huntId } = req.params
  const { huntProps } = req.body
  try {
    const [updatedHunt] = await updateHunt(huntId, huntProps)
    res.status(200).json(updatedHunt)
  } catch (error) {
    res.status(401).json({
      error: 'Error updating hunt',
    })
  }
})

module.exports = router
