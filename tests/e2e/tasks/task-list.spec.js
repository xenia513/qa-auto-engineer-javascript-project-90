import { test, expect } from '../utils/fixtures.js'

test.describe('Tasks list tests', () => {
  let title, createdTask, content

  test.beforeEach(async ({ taskPage, testData }) => {
    await taskPage.goto()
    title = testData.title
    content = testData.title
    createdTask = taskPage.getItem(title)
  })

  test('Table should be visible', async ({ taskPage, testData }) => {
    await expect(taskPage.items).not.toHaveCount(0)
  })

  test('Task data', async ({ taskPage, testData }) => {
    await expect(createdTask).toBeVisible()
    await taskPage.checkTask(title, testData.status, content)
    })

test.describe('Filter tests', () => {

    test('Filter by assignee', async ({ taskPage, testData }) => {
      await taskPage.applyFilter('Assignee', testData.email)
      await expect(createdTask).toBeVisible()
      await expect(taskPage.items).toHaveCount(1)
    })

    test('Filter by status', async ({ taskPage, testData }) => {
      await taskPage.applyFilter('Status', testData.status)
      const targetColumn = taskPage.getColumnByStatus(testData.status)
      const tasksInTarget = targetColumn.locator(taskPage.items)
      await expect(createdTask).toBeVisible()
      await expect(tasksInTarget).toHaveCount(1)
      })

    test('Filter by label', async ({ taskPage, testData }) => {
      await taskPage.applyFilter('Label', testData.label)
      await expect(createdTask).toBeVisible()
      await expect(taskPage.items).toHaveCount(1)
      })
    
    test('Filters reset', async ({ taskPage, testData }) => {
      await expect(taskPage.items.first()).toBeVisible()
      const initialCount = await taskPage.items.count()
      await taskPage.applyFilter('Assignee', testData.email)
      await taskPage.applyFilter('Status', testData.status)
      await taskPage.applyFilter('Label', testData.label)
      await expect(taskPage.items).toHaveCount(1)
      await taskPage.applyFilter('Assignee')
      await taskPage.applyFilter('Status')
      await taskPage.applyFilter('Label')
      await expect(taskPage.items).toHaveCount(initialCount)
      }
    )

    test('Empty result', async ({ taskPage, testData }) => {
      await taskPage.applyFilter('Assignee', testData.email)
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
