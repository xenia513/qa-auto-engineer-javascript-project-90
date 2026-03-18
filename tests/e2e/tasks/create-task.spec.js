import { test, expect } from '../utils/fixtures.js'

test.describe('Task create tests', () => {

  test('Form elements should be visible', async ({ taskPage }) => {
    await taskPage.gotoCreate()
    await taskPage.checkUIElements()
  })

  test('Creation succeed', async ({ taskPage, taskTestData, testUser, testStatus, testLabel }) => {
    const title = taskTestData.title
    const assignee = testUser.email
    const status = testStatus.status
    const content = taskTestData.content
    const label = testLabel.label
    await taskPage.successCreate(title, assignee, status, content, label)
    const createdTask = taskPage.getItem(title)
    const statusColumn = taskPage.getColumnByStatus(testStatus.status)
    await expect(statusColumn.locator(createdTask)).toBeVisible()
    await taskPage.checkItem(title, content)
    await taskPage.goToTaskEdit(title)
    await expect(taskPage.assigneeSelect).toHaveText(assignee)
    await expect(taskPage.labelSelect).toHaveText(label)
    })

  test.describe('Creation failed', () => {

    test('Empty fields', async ({ taskPage, taskTestData, testLabel }) => {
      await taskPage.gotoCreate()
      await taskPage.contentInput.fill(taskTestData.content)
      await taskPage.selectOption(taskPage.labelSelect, testLabel.label)
      await taskPage.checkEmptyFields()
    })
  })
})
