const model = require('./')
const { createNewCar, byHuntId } = require('./car')
const { findById: userById } = require('./user')

const Hunt = model({
  name: 'hunts',
  tableName: 'hunts',
  selectableProps: ['id', 'title', 'description', 'user_id', 'created_at'],
})

const getAllHunts = async () => {
  const hunts = await Hunt.findAll()
  const serializedHunts = await Promise.all(
    hunts.map(async hunt => await serializeHunt(hunt)),
  )
  return serializedHunts.filter(hunt => !!hunt.user && !!hunt.cars?.length)
}

const serializeHunt = async hunt => {
  const cars = await byHuntId(hunt.id)
  const [user] = await userById(hunt.user_id)
  return { ...hunt, cars, user }
}

const findById = async id => {
  const [foundHunt] = await Hunt.find({ id })
  return await serializeHunt(foundHunt)
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
