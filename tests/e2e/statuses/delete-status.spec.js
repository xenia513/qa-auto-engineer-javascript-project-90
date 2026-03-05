import { test, expect } from '../utils/fixtures.js'
import { faker } from '@faker-js/faker'

test.describe('Delete status tests', () => {
  let id, name

  test.beforeEach(async ({ statusPage, statusesPage }) => {
    name = faker.book.title()
    const slug = faker.book.author()
    await statusPage.successCreate(name, slug)
    await statusesPage.goto()
    id = await statusesPage.getStatusIdByName(name)
  })

  test('Delete from status page', async ({ statusPage, statusesPage }) => {
    await statusesPage.gotoStatus(id)
    await statusPage.deleteButton.click()
    await statusesPage.checkDeleteStatus(name, id)
  })

  test('Delete from statuses list', async ({ statusesPage }) => {
    await statusesPage.selectStatusByName(name)
    await statusesPage.deleteButton.click()
    await statusesPage.checkDeleteStatus(name, id)
  })

  test('Delete all statuses from statuses list', async ({ statusesPage }) => {
    await statusesPage.goto()
    await statusesPage.selectAllStatuses()
    await statusesPage.deleteButton.click()
    await expect(statusesPage.massDeletePopup).toBeVisible()
    await expect(statusesPage.tableBody).not.toBeVisible()
    await expect(statusesPage.emptyState).toBeVisible()
  })
})
