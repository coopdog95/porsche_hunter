exports.up = function (knex) {
  return knex.schema.createTable('hunts', table => {
    table.increments()
    table.integer('title')
    table.text('description')
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .index()
      .onDelete('CASCADE')
      .onUpdate('CASCADE')

    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('hunts')
}
