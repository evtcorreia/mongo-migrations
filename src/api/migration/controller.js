import { success, notFound } from '../../services/response/'
import { Migration } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  Migration.create(body)
    .then((migration) => migration.view(true))
    .then(success(res, 201))
    .catch(next)

export const executeMigration = async ({ bodymen: { body } }, res, next) =>{
  try {
    await 
  } catch (error) {
    
  }


}

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Migration.count(query)
    .then(count => Migration.find(query, select, cursor)
      .then((migrations) => ({
        count,
        rows: migrations.map((migration) => migration.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Migration.findById(params.id)
    .then(notFound(res))
    .then((migration) => migration ? migration.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Migration.findById(params.id)
    .then(notFound(res))
    .then((migration) => migration ? Object.assign(migration, body).save() : null)
    .then((migration) => migration ? migration.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Migration.findById(params.id)
    .then(notFound(res))
    .then((migration) => migration ? migration.remove() : null)
    .then(success(res, 204))
    .catch(next)
