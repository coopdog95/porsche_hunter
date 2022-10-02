var AWS = require('aws-sdk')

AWS.config.update({ region: 'us-west-1' })
s3 = new AWS.S3({ apiVersion: '2006-03-01' })

const listBuckets = () =>
  s3.listBuckets(function (err, data) {
    if (err) {
      console.log('Error', err)
    } else {
      console.log('Success', data.Buckets)
    }
  })

module.exports = {
  listBuckets,
}
