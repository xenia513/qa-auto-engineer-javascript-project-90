import { test, expect } from '../utils/fixtures.js'
import { faker } from '@faker-js/faker'

test.describe('Task edit tests', () => {

  test.beforeEach(async ({ taskPage, testData }) => {
    await taskPage.goto()
    const id = await taskPage.getId(testData.title)
    await taskPage.gotoItem(id)

    })
  
  test('Form elements should be visible', async ({ taskPage }) => {
    await taskPage.checkUIElements()
  })

  test('Update succeed', async ({ taskPage, testData }) => {
    const assignee = testData.email
    const title = faker.book.title()
    const content = 'edited task'
    await taskPage.successEdit(title, assignee, testData.status, content, testData.label)
    await taskPage.expectUpdateSuccess()
    const editedTask = taskPage.getItem(title)
    const statusColumn = taskPage.getColumnByStatus(testData.status)
    await expect(statusColumn.locator(editedTask)).toBeVisible()
    await taskPage.checkItem(title, content)
    await taskPage.goToTaskEdit(title)
    await expect(taskPage.assigneeSelect).toHaveText(testData.email)
    await expect(taskPage.labelSelect).toHaveText(testData.label)
  })
})
