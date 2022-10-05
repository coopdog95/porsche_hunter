var AWS = require('aws-sdk')
const crypto = require('crypto')

AWS.config.update({ region: 'us-west-1' })
const s3Bucket = new AWS.S3({ params: { Bucket: process.env.S3_BUCKET_ID } })

const baseUrl = 'https://porsche-hunter.s3.us-west-1.amazonaws.com'

const uploadImage = async imageData => {
  var buf = Buffer.from(
    imageData.replace(/^data:image\/\w+;base64,/, ''),
    'base64',
  )
  const key = crypto.randomUUID()
  var data = {
    Key: key,
    ContentEncoding: 'base64',
    Body: buf,
    ContentType: 'image/jpeg',
  }
  try {
    await s3Bucket.putObject(data).promise()
    return `${baseUrl}/${key}`
  } catch (error) {
    console.error('upload error: ', error)
    return null
  }
}

const deleteImage = async imageUrl => {
  if (!imageUrl) return

  const key = imageUrl.split(`${baseUrl}/`)[1]
  try {
    await s3Bucket.deleteObject({ Key: key }).promise()
  } catch (error) {
    console.log('delete error', error)
  }
}

module.exports = {
  uploadImage,
  deleteImage,
}
