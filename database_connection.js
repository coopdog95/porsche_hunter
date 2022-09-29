const environment = process.env.DATABASE_ENV
const config = require('./knexfile')[environment]
const knex = require('knex')(config)

module.exports = knex
