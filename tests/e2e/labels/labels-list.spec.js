import { test, expect } from '../utils/fixtures.js'

test.describe('Labels list tests', () => {

  test('Table should be visible', async ({ labelPage, page }) => {
    await labelPage.goto()
    await expect(page).toHaveURL(/.*labels/, { timeout: 10000 })
    await expect(page.getByRole('heading', { name: 'Labels' })).toBeVisible({ timeout: 30000 })
    await expect(labelPage.tableBody).toBeVisible()
  })

  test.describe('Table data', () => {
    let name

    test.beforeEach(async ({ labelPage, testData }) => {
      await labelPage.goto()
      name = testData.label
    })

    test('Label data', async ({ labelPage }) => {
      await labelPage.checkItem(name)
    })

    test('Pagination', async ({ labelPage }) => {
      const size = 5
      await labelPage.setPageSize(size)
      await expect(labelPage.tableRows).toHaveCount(size)
      await expect(labelPage.paginationInfo).toHaveText(new RegExp(String.raw`1-${size} of \d+`))
    })
  })
})
