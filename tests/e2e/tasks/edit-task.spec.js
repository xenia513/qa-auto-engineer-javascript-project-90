import { test, expect } from '../utils/fixtures.js'
import { faker } from '@faker-js/faker'

test.describe('Task edit tests', () => {
  let title, content

  test.beforeEach(async ({ taskPage, tasksPage, testData }) => {
    title = faker.book.title()
    content = faker.lorem.sentence()
    await taskPage.successCreate(testData.email, title, testData.status, content, testData.label)
    await tasksPage.goto()
    await tasksPage.goToTaskEdit(title)
    })
  
  test('Form elements should be visible', async ({ taskPage }) => {
    await taskPage.checkUIElements()
    await expect(taskPage.submitButton).toBeDisabled()
  })

  test('Update succeed', async ({ taskPage, tasksPage, testData }) => {
    const assignee = testData.email
    const title = faker.book.title()
    const content = 'edited task'
    await taskPage.successEdit(assignee, title, testData.status, content, testData.label)
    await expect(tasksPage.updatePopup).toBeVisible()
    await tasksPage.goto()
    await tasksPage.checkTaskByTitle(title, testData.status, content)
  })
})
