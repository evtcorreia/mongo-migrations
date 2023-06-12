import { Migration } from '.'

let migration

beforeEach(async () => {
  migration = await Migration.create({ name: 'test', status: 'test', version: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = migration.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(migration.id)
    expect(view.name).toBe(migration.name)
    expect(view.status).toBe(migration.status)
    expect(view.version).toBe(migration.version)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = migration.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(migration.id)
    expect(view.name).toBe(migration.name)
    expect(view.status).toBe(migration.status)
    expect(view.version).toBe(migration.version)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
