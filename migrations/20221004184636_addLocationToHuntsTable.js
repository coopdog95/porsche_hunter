exports.up = function (knex) {
  return knex.schema.table('hunts', function (t) {
    t.float('latitude', 14, 10)
    t.float('longitude', 14, 10)
  })
}

exports.down = function (knex) {
  return knex.schema.table('hunts', function (t) {
    t.dropColumn('latitude')
    t.dropColumn('longitude')
  })
}
