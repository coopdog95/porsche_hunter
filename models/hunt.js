const model = require('./')
const { createNewCar } = require('./car')

const Hunt = model({
  name: 'hunts',
  tableName: 'hunts',
  selectableProps: ['id', 'title', 'description', 'user_id'],
})

const getAllHunts = async () => await Hunt.findAll()

const findById = async id => {
  const [foundHunt] = await Hunt.find({ id })
  return foundHunt
}

const updateHunt = async (huntId, huntProps) =>
  await Hunt.update(huntId, huntProps)

const createNewHunt = async (hunt, cars) => {
  if (!cars?.length) return Promise.reject('No cars added to hunt')

  const [newHunt] = await Hunt.create(hunt)
  const createdCars = await Promise.all(
    cars.map(async car => {
      const [newCar] = await createNewCar({ ...car, hunt_id: newHunt.id })
      return newCar
    }),
  )
  return { hunt: newHunt, cars: createdCars }
}

module.exports = {
  getAllHunts,
  findById,
  updateHunt,
  createNewHunt,
}
