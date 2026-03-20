import { test, expect } from '../utils/fixtures.js'

test.describe('Task delete tests', () => {
  let id, title, item, countBefore, countAfter

  test.beforeEach(async ({ taskPage, testTask }) => {
    title = testTask.title
    await taskPage.goto()
    item = taskPage.getItem(title)
    await expect(item).toBeVisible()
    id = await taskPage.getId(title)
    countBefore = await taskPage.items.count()
    })

    test('Delete from edit page', async ({ taskPage }) => {
      await taskPage.gotoItem(id)
      await taskPage.deleteItem(title, id)
      countAfter = await taskPage.items.count()
      await expect(countAfter).toBe(countBefore - 1)
  })

    test('Undo deletion from show page', async ({ taskPage }) => {
      await taskPage.goToTaskShow(title)
      await taskPage.undoDeleteItem(title)
      await expect(taskPage.items).toHaveCount(countBefore)
  })
})
