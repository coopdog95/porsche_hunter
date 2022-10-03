exports.up = function (knex) {
  return knex.schema.createTable('cars', table => {
    table.increments()
    table.string('model').notNullable().index()
    table.string('trim').notNullable().index()
    table.string('image_url')
    table
      .integer('hunt_id')
      .unsigned()
      .references('id')
      .inTable('hunts')
      .index()
      .onDelete('CASCADE')
      .onUpdate('CASCADE')

    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('cars')
}
