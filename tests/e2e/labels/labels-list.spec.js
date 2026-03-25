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

    test.beforeEach(async ({ labelPage, testLabel }) => {
      await labelPage.goto()
      name = testLabel.label
    })

    test('Label data', async ({ labelPage }) => {
      await labelPage.checkItem(name)
    })

    test('Pagination', async ({ labelPage }) => {
      for (let i = 0; i < 11; i++) {
        await labelPage.successCreate(
          `label${i}`
        )
      }

      await labelPage.goto()
      await labelPage.checkPagination()
    })
  })
})
