import { test, expect } from '../utils/fixtures.js'
import { faker } from '@faker-js/faker'

test.describe('Tasks list tests', () => {
  let title, createdTask, content, wrongTask

  test.beforeEach(async ({ taskPage, testTask }) => {
    await taskPage.goto()
    title = testTask.title
    content = testTask.content
    createdTask = taskPage.getItem(title)
  })

  test('Table should be visible', async ({ taskPage, page }) => {
    await expect(page.getByText('Tasks').first()).toBeVisible({ timeout: 10000 })
    await expect(taskPage.items).not.toHaveCount(0)
  })

  test('Task data', async ({ taskPage, testStatus }) => {
    await expect(createdTask).toBeVisible()
    await taskPage.checkTask(title, testStatus.status, content)
  })

  test.describe('Filter tests', () => {
    test.beforeEach(async ({ taskPage, userPage, statusPage, testUser, testStatus }) => {
      const otherEmail = faker.internet.email()
      await userPage.successCreate(otherEmail, 'Other', 'User')
      const otherStatusName = faker.word.noun()
      await statusPage.successCreate(otherStatusName, faker.lorem.slug())
      await taskPage.successCreate('WrongTask', otherEmail, otherStatusName)
      wrongTask = taskPage.getItem('WrongTask')
    })

    test('Filter by assignee', async ({ taskPage, testUser }) => {
      await taskPage.applyFilter('Assignee', testUser.email)
      await expect(createdTask).toBeVisible()
      await expect(taskPage.items).toHaveCount(1)
      await taskPage.checkFilteredItems(testUser.email, 1)
    })

    test('Filter by status', async ({ taskPage, testStatus }) => {
      await taskPage.applyFilter('Status', testStatus.status)
      const targetColumn = taskPage.getColumnByStatus(testStatus.status)
      const tasksInTarget = targetColumn.locator(taskPage.items)
      await expect(createdTask).toBeVisible()
      await expect(wrongTask).not.toBeVisible()
      await expect(tasksInTarget).toHaveCount(1)
      await expect(taskPage.items).toHaveCount(1)
    })

    test('Filter by label', async ({ taskPage, testLabel }) => {
      await taskPage.applyFilter('Label', testLabel.label)
      await expect(createdTask).toBeVisible()
      await expect(wrongTask).not.toBeVisible()
      await taskPage.checkFilteredItems(testLabel.label, 1)
    })
    
    test('Comby filters and reset', async ({ taskPage, testUser, testStatus, testLabel }) => {
      await expect(taskPage.items.first()).toBeVisible()
      const initialCount = await taskPage.items.count()
      await taskPage.applyFilter('Assignee', testUser.email)
      await taskPage.applyFilter('Status', testStatus.status)
      await taskPage.applyFilter('Label', testLabel.label)
      await expect(createdTask).toBeVisible()
      await expect(wrongTask).not.toBeVisible()
      await expect(taskPage.items).toHaveCount(1)
      await taskPage.resetAllFilters()
      await expect(taskPage.items).toHaveCount(initialCount)
    })

    test('Empty result', async ({ taskPage, testUser }) => {
      await taskPage.applyFilter('Assignee', testUser.email)
      await taskPage.applyFilter('Status', 'Published')
      await expect(taskPage.items).toHaveCount(0)
    })
  })

  test('Drag-and-Drop test', async ({ taskPage }) => {
    const newStatus = 'To Review'
    await taskPage.dragTaskToStatus(title, newStatus)
    const targetColumn = taskPage.getColumnByStatus(newStatus)
    await expect(targetColumn.locator(createdTask)).toBeVisible()
  })
})
