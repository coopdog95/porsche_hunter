const model = require('./')

const Car = model({
  name: 'cars',
  tableName: 'cars',
  selectableProps: ['id', 'year', 'model', 'trim', 'image_url', 'hunt_id'],
})

const getAllCars = async () => await Car.findAll()

const byHuntId = async huntId => await Car.find({ hunt_id: huntId })

const createNewCar = async car => {
  if (car.image_data) {
    const imageUrl = await uploadImageData(imageData)
    delete car.image_data
    return await Car.create({
      ...car,
      image_url: imageUrl,
    })
  }
  await Car.create(car)
}

const findById = async id => {
  const [foundCar] = await Car.find({ id })
  return foundCar
}

const updateCar = async (carId, carProps) => await Car.update(carId, carProps)

const uploadImageData = async imageData => {
  console.log('uploading image data...', imageData?.slice(0, 50))
}

module.exports = {
  byHuntId,
  createNewCar,
  findById,
  getAllCars,
  updateCar,
}
