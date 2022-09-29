module.exports = ({
  knex = require('../database_connection'),
  name = '',
  tableName = '',
  selectableProps = [],
  timeout = 1000,
}) => {
  const query = knex.from(tableName)

  const create = props => {
    delete props.id
    return knex
      .insert(props)
      .returning(selectableProps)
      .into(tableName)
      .timeout(timeout)
  }
  const findAll = () =>
    knex.select(selectableProps).from(tableName).timeout(timeout)

  const find = filters =>
    knex.select(selectableProps).from(tableName).where(filters).timeout(timeout)

  const update = (id, props) => {
    delete props.id

    return knex
      .update(props)
      .from(tableName)
      .where({
        id,
      })
      .returning(selectableProps)
      .timeout(timeout)
  }

  const destroy = id =>
    knex
      .del()
      .from(tableName)
      .where({
        id,
      })
      .timeout(timeout)

  return {
    query,
    name,
    tableName,
    selectableProps,
    timeout,
    create,
    findAll,
    find,
    update,
    destroy,
  }
}
