import { test, expect } from '../utils/fixtures.js'

test.describe('Statuses list tests', () => {

  test('Table should be visible', async ({ statusPage, page }) => {
    await statusPage.goto()
    await expect(page.getByText('Task statuses').first()).toBeVisible({ timeout: 10000 })
    await expect(statusPage.tableBody).toBeVisible()
  })

  test.describe('Table data', () => {
    let name, slug

    test.beforeEach(async ({ statusPage, testStatus }) => {
      await statusPage.goto()
      name = testStatus.status
      slug = testStatus.slug
    })

    test('Status data', async ({ statusPage }) => {
      await statusPage.checkItem(name, slug)
    })

    test('Pagination', async ({ statusPage }) => {
      await statusPage.checkPagination()
    })
  })
})
