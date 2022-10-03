var express = require('express')
var router = express.Router()
const {
  getAllCars,
  createNewCar,
  findById,
  updateCar,
  deleteCar,
} = require('../models/car')

router.get('/', async (req, res, next) => {
  const cars = await getAllCars()
  res.json(cars)
})

router.get('/:carId', async (req, res, next) => {
  const { carId } = req.params
  const car = await findById(carId)
  if (!car) {
    res.status(401).json({
      error: `No car with id ${carId} found`,
    })
  } else {
    res.json(car)
  }
})

router.post('/', async (req, res, next) => {
  const { carProps } = req.body
  try {
    const [car] = await createNewCar(carProps)
    res.status(201).json(car)
  } catch (error) {
    res.status(401).json({
      error: `Car could not be created: ${error}`,
    })
  }
})

router.patch('/:carId', async (req, res, next) => {
  const { carId } = req.params
  const { carProps } = req.body
  try {
    const [updatedCar] = await updateCar(carId, carProps)
    res.status(200).json(updatedCar)
  } catch (error) {
    res.status(401).json({
      error: 'Error updating car',
    })
  }
})

router.delete('/:carId', async (req, res, next) => {
  const { carId } = req.params
  try {
    await deleteCar(carId)
    res.status(200).json({ message: `Car ${carId} }deleted` })
  } catch (error) {
    res.status(401).json({
      error: 'Error deleting car',
    })
  }
})

module.exports = router
