import { test, expect } from '../utils/fixtures.js'

test.describe('Task edit tests', () => {

  test.beforeEach(async ({ taskPage, testTask }) => {
    await taskPage.goto()
    const id = await taskPage.getId(testTask.title)
    await taskPage.gotoItem(id)

    })
  
  test('Form elements should be visible', async ({ taskPage }) => {
    await taskPage.checkUIElements()
  })

  test('Update succeed', async ({ taskPage, taskTestData, testUser, testStatus, testLabel }) => {
    const title = `${taskTestData.title}-updated`
    const assignee = testUser.email
    const status = testStatus.status
    const label = testLabel.label
    const content = 'edited task'
    await taskPage.successEdit(title, assignee, status, content, label)
    await taskPage.expectUpdateSuccess()
    const editedTask = taskPage.getItem(title)
    const statusColumn = taskPage.getColumnByStatus(status)
    await expect(statusColumn.locator(editedTask)).toBeVisible()
    await taskPage.checkItem(title, content)
    await taskPage.goToTaskEdit(title)
    await expect(taskPage.assigneeSelect).toHaveText(assignee)
    await expect(taskPage.labelSelect).toHaveText(label)
  })
})
