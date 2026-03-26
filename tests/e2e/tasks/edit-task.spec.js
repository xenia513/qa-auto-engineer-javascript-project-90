import { test, expect } from '../utils/fixtures.js'

test.describe('Task edit tests', () => {

  test('Update succeed', async ({ taskPage, taskTestData, testUser, testStatus, testLabel, testTask }) => {
    await taskPage.goto()
    const countBefore = await taskPage.items.count()
    const title = `${taskTestData.title}-updated`
    const assignee = testUser.email
    const status = testStatus.status
    const label = testLabel.label
    const content = 'edited task'
    const id = await taskPage.getId(testTask.title)
    await taskPage.gotoItem(id)
    await taskPage.successEdit(title, null, null, content, null)
    await taskPage.expectUpdateSuccess()
    const editedTask = taskPage.getItem(title)
    const statusColumn = taskPage.getColumnByStatus(status)
    await expect(statusColumn.locator(editedTask)).toBeVisible()
    await taskPage.checkItem(title, content)
    await expect(taskPage.getItem(testTask.title)).not.toBeVisible()
    await expect(taskPage.items).toHaveCount(countBefore)
    await taskPage.goToTaskEdit(title)
    await expect(taskPage.assigneeSelect).toHaveText(assignee)
    await expect(taskPage.labelSelect).toHaveText(label)
  })

  test.describe('Form UI tests', () => {

    test.beforeEach(async ({ taskPage, testTask }) => {
      await taskPage.goto()
      const id = await taskPage.getId(testTask.title)
      await taskPage.gotoItem(id)
    })
  
    test('Form elements should be visible', async ({ taskPage }) => {
      await taskPage.checkUIElements()
    })
  })
})
