import { test, expect } from '../utils/fixtures.js'
import { faker } from '@faker-js/faker'

test.describe('Task create tests', () => {

  test('Form elements should be visible', async ({ taskPage }) => {
    await taskPage.gotoCreate()
    await taskPage.checkUIElements()
  })

  test('Creation succeed', async ({ taskPage, testData }) => {
    const title = faker.book.title()
    const content = faker.book.author()
    await taskPage.successCreate(title, testData.email, testData.status, content, testData.label)
    const createdTask = taskPage.getItem(title)
    const statusColumn = taskPage.getColumnByStatus(testData.status)
    await expect(statusColumn.locator(createdTask)).toBeVisible()
    await taskPage.checkItem(title, content)
    await taskPage.goToTaskEdit(title)
    await expect(taskPage.assigneeSelect).toHaveText(testData.email)
    await expect(taskPage.labelSelect).toHaveText(testData.label)
    })

  test.describe('Creation failed', () => {

    test('Empty fields', async ({ taskPage, testData }) => {
      await taskPage.gotoCreate()
      await taskPage.contentInput.fill(faker.book.genre())
      await taskPage.selectOption(taskPage.labelSelect, testData.label)
      await taskPage.checkEmptyFields()
    })
  })
})
