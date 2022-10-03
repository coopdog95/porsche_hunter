const model = require('./')
const { uploadImage, deleteImage } = require('../helpers/imageUpload')

const Car = model({
  name: 'cars',
  tableName: 'cars',
  selectableProps: ['id', 'model', 'trim', 'image_url', 'hunt_id'],
})

const getAllCars = async () => await Car.findAll()

const byHuntId = async huntId => await Car.find({ hunt_id: huntId })

const createOrUpdateCar = async (car, huntId) => {
  if (car.id) return await updateCar(car.id, car)
  return await createNewCar(car, huntId)
}

const createNewCar = async (car, huntId) => {
  if (car.image_data) {
    const imageUrl = await uploadImageData(car.image_data)
    delete car.image_data
    delete car.unsaved
    return await Car.create({
      ...car,
      image_url: imageUrl,
      hunt_id: huntId,
    })
  }
  await Car.create(car)
}

const findById = async id => {
  const [foundCar] = await Car.find({ id })
  return foundCar
}

const deleteCar = async id => {
  const { image_url } = await findById(id)
  await Car.destroy(id)
  await deleteImage(image_url)
}

const updateCar = async (carId, carProps) => {
  if (carProps.image_data) {
    const imageUrl = await uploadImageData(carProps.image_data)
    delete carProps.image_data
    carProps.image_url = imageUrl
  }
  await Car.update(carId, carProps)
}

const uploadImageData = async imageData => {
  const imageUrl = await uploadImage(imageData)
  console.log('imageUrl', imageUrl)
  return imageUrl
}

module.exports = {
  byHuntId,
  createNewCar,
  findById,
  getAllCars,
  updateCar,
  createOrUpdateCar,
  deleteCar,
}
