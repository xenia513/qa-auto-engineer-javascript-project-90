import { test, expect } from '../utils/fixtures.js'
import { faker } from '@faker-js/faker'

test.describe('Statuses list tests', () => {

  test('Table should be visible', async ({ statusesPage }) => {
    await statusesPage.goto()
    await expect(statusesPage.tableBody).toBeVisible()
  })

  test.describe('Table data', () => {
    let id, name, slug

    test.beforeEach(async ({ statusPage, statusesPage }) => {
      name = faker.book.title()
      slug = faker.book.author()
      await statusPage.successCreate(name, slug)
      await statusesPage.goto()
      id = await statusesPage.getStatusIdByName(name)
    })

    test('Status data', async ({ statusesPage }) => {
      await statusesPage.checkStatusByName(name, slug)
    })

    test('Pagination', async ({ statusesPage }) => {
      const size = 5
      await statusesPage.setPageSize(size)
      await expect(statusesPage.tableRows).toHaveCount(size)
      await expect(statusesPage.paginationInfo).toHaveText(`1-${size} of ${id}`)
    })
  })
})
