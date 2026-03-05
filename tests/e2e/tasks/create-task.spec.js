import { test, expect } from '../utils/fixtures.js'
import { faker } from '@faker-js/faker'

test.describe('Task create tests', () => {

  test('Form elements should be visible', async ({ taskPage }) => {
    await taskPage.gotoCreate()
    await taskPage.checkUIElements()
    await expect(taskPage.submitButton).toBeDisabled()
  })

  test('Creation succeed', async ({ taskPage, tasksPage, testData }) => {
    const title = faker.book.title()
    const content = null
    await taskPage.successCreate(testData.email, title, testData.status, content, testData.label)
    await expect(taskPage.createPopup).toBeVisible()
    await tasksPage.goto()
    await tasksPage.checkTaskByTitle(title, testData.status, content)
    await tasksPage.goToTaskEdit(title)
    await expect(taskPage.assigneeSelect).toHaveText(testData.email)
    await expect(taskPage.labelSelect).toHaveText(testData.label)
    })

  test.describe('Creation failed', () => {

    test('Empty fields', async ({ taskPage, testData }) => {
      await taskPage.gotoCreate()
      await taskPage.fillContent(faker.book.genre())
      await taskPage.selectLabel(testData.label)
      await taskPage.checkEmptyFields()
    })
  })
})
