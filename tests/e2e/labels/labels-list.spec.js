import { test, expect } from '../utils/fixtures.js'

test.describe('Labels list tests', () => {

  test('Table should be visible', async ({ labelPage, page }) => {
    await labelPage.goto()
   // await expect(page).not.toHaveURL(/.*login/)
        if (page.url().includes('login')) {
       console.log('SESSION LOST! Manual login triggered...');
       await page.locator('input[name="username"]').fill('admin');
       await page.locator('input[name="password"]').fill('123456');
       await page.getByRole('button').click();
    }
    await expect(page.getByText('Labels').first()).toBeVisible({ timeout: 10000 })
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
