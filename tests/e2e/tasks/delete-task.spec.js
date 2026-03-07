import { test, expect } from '../utils/fixtures.js'

test.describe('Task delete tests', () => {
  let id, title

  test.beforeEach(async ({ taskPage, testData }) => {
    title = testData.title
    await taskPage.goto()
    await expect(taskPage.getItem(title)).toBeVisible()
    id = await taskPage.getId(title)
    })

    test('Delete from edit page', async ({ taskPage }) => {
      await taskPage.gotoItem(id)
      await taskPage.deleteItem(title, id)
  })

    test('Delete from show page', async ({ taskPage }) => {
      await taskPage.goToTaskShow(title)
      await taskPage.deleteItem(title, id)
  })
})
