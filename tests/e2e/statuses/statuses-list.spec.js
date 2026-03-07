import { test, expect } from '../utils/fixtures.js'

test.describe('Statuses list tests', () => {

  test('Table should be visible', async ({ statusPage }) => {
    await statusPage.goto()
    await expect(statusPage.tableBody).toBeVisible()
  })

  test.describe('Table data', () => {
    let name, slug

    test.beforeEach(async ({ statusPage, testData }) => {
      await statusPage.goto()
      name = testData.status
      slug = testData.slug
    })

    test('Status data', async ({ statusPage }) => {
      await statusPage.checkItem(name, slug)
    })

    test('Pagination', async ({ statusPage }) => {
      const size = 5
      await statusPage.setPageSize(size)
      await expect(statusPage.tableRows).toHaveCount(size)
      await expect(statusPage.paginationInfo).toHaveText(new RegExp(String.raw`1-${size} of \d+`))
    })
  })
})
