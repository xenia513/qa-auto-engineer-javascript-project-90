import { test, expect } from '../utils/fixtures.js'

test.describe('Delete status tests', () => {
  let id, name, countBefore, countAfter

  test.beforeEach(async ({ statusPage, testData }) => {
    await statusPage.goto()
    name = testData.status
    id = await statusPage.getId(name)
    countBefore = await statusPage.items.count()
  })

  test('Delete from status page', async ({ statusPage }) => {
    await statusPage.gotoItem(id)
    await statusPage.deleteItem(name, id)
    countAfter = await statusPage.items.count()
    await expect(countAfter).toBe(countBefore - 1)
  })

  test('Delete from statuses list', async ({ statusPage }) => {
    await statusPage.selectItem(name)
    await statusPage.deleteItem(name, id)
    countAfter = await statusPage.items.count()
    await expect(countAfter).toBe(countBefore - 1)
  })

  test('Delete all statuses from statuses list', async ({ statusPage }) => {
    await statusPage.setPageSize(50)
    await statusPage.deleteAll()
  })
})
