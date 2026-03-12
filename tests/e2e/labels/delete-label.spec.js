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

  test('Undo deletion from labels list', async ({ labelPage }) => {
    await labelPage.selectItem(name)
    await labelPage.deleteButton.click({ force: true })
    await labelPage.undoButton.click()
    await expect(labelPage.deletePopup).toBeHidden()
    await expect(labelPage.items).toHaveCount(countBefore)
    await expect(labelPage.getItem(name)).toBeVisible()
  })

  test('Delete all labels from labels list', async ({ labelPage }) => {
    await labelPage.deleteAll()
  })
})
