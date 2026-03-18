import { test, expect } from '../utils/fixtures.js'

test.describe('Task delete tests', () => {
  let id, title, countBefore, countAfter

  test.beforeEach(async ({ taskPage, testTask }) => {
    title = testTask.title
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

    test('Undo deletion from show page', async ({ taskPage }) => {
      await taskPage.goToTaskShow(title)
      await taskPage.deleteButton.click({ force: true })
      await taskPage.undoButton.click()
      await expect(taskPage.deletePopup).toBeHidden()
      await expect(taskPage.items).toHaveCount(countBefore)
      await expect(taskPage.getItem(title)).toBeVisible()
  })
})
