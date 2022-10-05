const model = require('./')
const {
  createNewCar,
  byHuntId: carsByHuntId,
  createOrUpdateCar,
} = require('./car')
const { deleteImage } = require('../helpers/imageUpload')
const { findById: userById } = require('./user')

const Hunt = model({
  name: 'hunts',
  tableName: 'hunts',
  selectableProps: [
    'id',
    'title',
    'description',
    'user_id',
    'latitude',
    'longitude',
    'created_at',
  ],
})

const getAllHunts = async () => {
  const hunts = await Hunt.findAll().orderBy('created_at', 'desc')
  const serializedHunts = await Promise.all(
    hunts.map(async hunt => await serializeHunt(hunt)),
  )
  return serializedHunts.filter(hunt => !!hunt.user && !!hunt.cars?.length)
}

const serializeHunt = async hunt => {
  const cars = await carsByHuntId(hunt.id)
  const [user] = await userById(hunt.user_id)
  return { ...hunt, cars, user }
}

const findById = async id => {
  const [foundHunt] = await Hunt.find({ id })
  return await serializeHunt(foundHunt)
}

const updateHunt = async (huntId, huntProps, cars) => {
  const [updatedHunt] = await Hunt.update(huntId, huntProps)
  await Promise.all(
    cars.map(async car => await createOrUpdateCar(car, updatedHunt.id)),
  )
  return await serializeHunt(updatedHunt)
}

const createNewHunt = async (userId, hunt, cars) => {
  if (!cars?.length) return Promise.reject('No cars added to hunt')
  const huntProps = { ...hunt, user_id: userId }
  const [newHunt] = await Hunt.create(huntProps)
  await Promise.all(cars.map(async car => await createNewCar(car, newHunt.id)))
  return await serializeHunt(newHunt)
}

const deleteHunt = async huntId => {
  const cars = await carsByHuntId(huntId)
  await Promise.all(cars.map(async car => await deleteImage(car.image_url)))
  await Hunt.destroy(huntId)
}

module.exports = {
  getAllHunts,
  findById,
  updateHunt,
  createNewHunt,
  deleteHunt,
}
