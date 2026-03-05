import { test, expect } from '../utils/fixtures.js'
import { faker } from '@faker-js/faker'

test.describe('Tasks list tests', () => {
  let title, content, createdTask

  test.beforeEach(async ({ taskPage, tasksPage, testData }) => {
    title = faker.book.title()
    content = null
    await taskPage.successCreate(testData.email, title, testData.status, content, testData.label)
    createdTask = tasksPage.getTaskByTitle(title)
    await tasksPage.goto()
    })

  test('Table should be visible', async ({ tasksPage }) => {
    await expect(tasksPage.taskCards).not.toHaveCount(0)
  })

  test('Task data', async ({ tasksPage, testData }) => {
    await expect(createdTask).toBeVisible()
    await tasksPage.checkTaskByTitle(title, testData.status, content)
    })

  test('Filter by assignee', async ({ tasksPage, testData }) => {
    await tasksPage.filterByAssignee(testData.email)
    await expect(createdTask).toBeVisible()
    await expect(tasksPage.taskCards).toHaveCount(1)
  })

  test('Filter by status', async ({ tasksPage, testData }) => {
    await tasksPage.filterByStatus(testData.status)
    const targetColumn = tasksPage.getColumnByStatus(testData.status)
    const tasksInTarget = targetColumn.locator(tasksPage.taskCards)
    await expect(createdTask).toBeVisible()
    await expect(tasksInTarget).toHaveCount(1)
    })

  test('Filter by label', async ({ tasksPage, testData }) => {
    await tasksPage.filterByLabel(testData.label)
    await expect(createdTask).toBeVisible()
    await expect(tasksPage.taskCards).toHaveCount(1)
    })
  
  test('Empty filters', async ({ tasksPage, testData }) => {
    await expect(tasksPage.taskCards.first()).toBeVisible()
    const initialCount = await tasksPage.taskCards.count()
    await tasksPage.filterByAssignee(testData.email)
    await tasksPage.filterByStatus(testData.status)
    await tasksPage.filterByLabel(testData.label)
    await expect(tasksPage.taskCards).toHaveCount(1)
    await tasksPage.resetFilter('Assignee')
    await tasksPage.resetFilter('Status')
    await tasksPage.resetFilter('Label')
    await expect(tasksPage.taskCards).toHaveCount(initialCount)
    }
  )

  test('Empty result', async ({ tasksPage, testData }) => {
    await tasksPage.filterByAssignee(testData.email)
    await tasksPage.filterByStatus('Published')
    await expect(tasksPage.taskCards).toHaveCount(0)
  })

  test('Drag-and-Drop test', async ({ tasksPage }) => {
    const newStatus = 'To Review'
    await tasksPage.dragTaskToStatus(title, newStatus)
    const targetColumn = tasksPage.getColumnByStatus(newStatus)
    await expect(targetColumn.locator(createdTask)).toBeVisible()
  })
})
