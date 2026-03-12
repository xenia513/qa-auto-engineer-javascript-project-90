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

  test('Delete from statuses list and undo', async ({ statusPage }) => {
    await statusPage.selectItem(name)
    await statusPage.deleteButton.click({ force: true })
    await statusPage.undoButton.click()
    await expect(statusPage.deletePopup).toBeHidden()
    await expect(statusPage.items).toHaveCount(countBefore)
    await expect(statusPage.getItem(name)).toBeVisible()
  })

  test('Delete all statuses from statuses list', async ({ statusPage }) => {
    await statusPage.deleteAll()
  })
})
