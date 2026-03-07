import { test } from '../utils/fixtures.js'

test.describe('Delete status tests', () => {
  let id, name

  test.beforeEach(async ({ statusPage, testData }) => {
    await statusPage.goto()
    name = testData.status
    id = await statusPage.getId(name)
  })

  test('Delete from status page', async ({ statusPage }) => {
    await statusPage.gotoItem(id)
    await statusPage.deleteItem(name, id)
  })

  test('Delete from statuses list', async ({ statusPage }) => {
    await statusPage.selectItem(name)
    await statusPage.deleteItem(name, id)
  })

  test('Delete all statuses from statuses list', async ({ statusPage }) => {
    await statusPage.deleteAll()
  })
})
