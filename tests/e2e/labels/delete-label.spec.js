import { test, expect } from '../utils/fixtures.js'

test.describe('Label delete tests', () => {
  let id, name, item, countBefore, countAfter

  test.beforeEach(async ({ labelPage, testLabel }) => {
    await labelPage.goto()
    name = testLabel.label
    id = await labelPage.getId(name)
    item = labelPage.getItem(name)
    await expect(item).toBeVisible()
    countBefore = await labelPage.items.count()
  })

  test('Delete from label page', async ({ labelPage }) => {
    await labelPage.gotoItem(id)
    await labelPage.deleteItem(name, id)
    countAfter = await labelPage.items.count()
    await expect(countAfter).toBe(countBefore - 1)
  })

  test('Undo deletion from labels list', async ({ labelPage }) => {
    await labelPage.selectItem(name)
    await labelPage.undoDeleteItem(name)
    await expect(labelPage.items).toHaveCount(countBefore)

  })

  test('Delete all labels from labels list', async ({ labelPage }) => {
    await labelPage.deleteAll()
  })
})
