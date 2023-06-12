import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Migration } from '.'

const app = () => express(apiRoot, routes)

let userSession, migration

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  userSession = signSync(user.id)
  migration = await Migration.create({})
})

test('POST /migrations 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, name: 'test', status: 'test', version: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.name).toEqual('test')
  expect(body.status).toEqual('test')
  expect(body.version).toEqual('test')
})

test('POST /migrations 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /migrations 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /migrations 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /migrations/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${migration.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(migration.id)
})

test('GET /migrations/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${migration.id}`)
  expect(status).toBe(401)
})

test('GET /migrations/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /migrations/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${migration.id}`)
    .send({ access_token: userSession, name: 'test', status: 'test', version: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(migration.id)
  expect(body.name).toEqual('test')
  expect(body.status).toEqual('test')
  expect(body.version).toEqual('test')
})

test('PUT /migrations/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${migration.id}`)
  expect(status).toBe(401)
})

test('PUT /migrations/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: userSession, name: 'test', status: 'test', version: 'test' })
  expect(status).toBe(404)
})

test('DELETE /migrations/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${migration.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /migrations/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${migration.id}`)
  expect(status).toBe(401)
})

test('DELETE /migrations/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})
