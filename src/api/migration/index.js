import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy, executeMigration } from './controller'
import { schema } from './model'
export Migration, { schema } from './model'

const router = new Router()
const { name, status, version } = schema.tree

/**
 * @api {post} /migrations Create migration
 * @apiName CreateMigration
 * @apiGroup Migration
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam name Migration's name.
 * @apiParam status Migration's status.
 * @apiParam version Migration's version.
 * @apiSuccess {Object} migration Migration's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Migration not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ name, status, version }),
  create)

router.post('/migration',
  token({ required: true }),
  body({ name, status, version }),
  executeMigration)

/**
 * @api {get} /migrations Retrieve migrations
 * @apiName RetrieveMigrations
 * @apiGroup Migration
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of migrations.
 * @apiSuccess {Object[]} rows List of migrations.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/',
  token({ required: true }),
  query(),
  index)

/**
 * @api {get} /migrations/:id Retrieve migration
 * @apiName RetrieveMigration
 * @apiGroup Migration
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} migration Migration's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Migration not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {put} /migrations/:id Update migration
 * @apiName UpdateMigration
 * @apiGroup Migration
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam name Migration's name.
 * @apiParam status Migration's status.
 * @apiParam version Migration's version.
 * @apiSuccess {Object} migration Migration's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Migration not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ name, status, version }),
  update)

/**
 * @api {delete} /migrations/:id Delete migration
 * @apiName DeleteMigration
 * @apiGroup Migration
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Migration not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
