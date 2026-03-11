import { test, expect } from '../utils/fixtures.js'

test.describe('Task delete tests', () => {
  let id, title, countBefore, countAfter

  test.beforeEach(async ({ taskPage, testData }) => {
    title = testData.title
    await taskPage.goto()
    await expect(taskPage.getItem(title)).toBeVisible()
    id = await taskPage.getId(title)
    countBefore = await taskPage.items.count()
    })

    test('Delete from edit page', async ({ taskPage }) => {
      await taskPage.gotoItem(id)
      await taskPage.deleteItem(title, id)
      countAfter = await taskPage.items.count()
      await expect(countAfter).toBe(countBefore - 1)
  })

    test('Delete from show page', async ({ taskPage }) => {
      await taskPage.goToTaskShow(title)
      await taskPage.deleteItem(title, id)
      countAfter = await taskPage.items.count()
      await expect(countAfter).toBe(countBefore - 1)
  })
})
