import { test, expect } from '../utils/fixtures.js'
import { faker } from '@faker-js/faker'

test.describe('Task delete tests', () => {
  let id, title

  test.beforeEach(async ({ taskPage, tasksPage, testData }) => {
    title = faker.book.title()
    const content = null
    await taskPage.successCreate(testData.email, title, testData.status, content, testData.label)
    await tasksPage.goto()
    await expect(tasksPage.getTaskByTitle(title)).toBeVisible()
    id = await tasksPage.getTaskIdByTitle(title)
    })

    test('Delete from edit page', async ({ taskPage, tasksPage }) => {
      await tasksPage.gotoTaskById(id)
      await taskPage.deleteButton.click()
      await tasksPage.checkDeleteTask(title, id)
  })

    test('Delete from show page', async ({ taskPage, tasksPage }) => {
      await tasksPage.goToTaskShow(title)
      await taskPage.deleteButton.click()
      await tasksPage.checkDeleteTask(title, id)
  })
})
