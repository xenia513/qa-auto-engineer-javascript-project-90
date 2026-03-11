import { test, expect } from '../utils/fixtures.js'

test.describe('Label delete tests', () => {
  let id, name, countBefore, countAfter

  test.beforeEach(async ({ labelPage, testData }) => {
    await labelPage.goto()
    name = testData.label
    id = await labelPage.getId(name)
    countBefore = await labelPage.items.count()
  })

  test('Delete from label page', async ({ labelPage }) => {
    await labelPage.gotoItem(id)
    await labelPage.deleteItem(name, id)
    countAfter = await labelPage.items.count()
    await expect(countAfter).toBe(countBefore - 1)
  })

  test('Delete from labels list', async ({ labelPage }) => {
    
    await labelPage.selectItem(name)
    await labelPage.deleteItem(name, id)
    countAfter = await labelPage.items.count()
    await expect(countAfter).toBe(countBefore - 1)
  })

  test('Delete all labels from labels list', async ({ labelPage }) => {
    await labelPage.setPageSize(50)
    await labelPage.deleteAll()
  })
})
