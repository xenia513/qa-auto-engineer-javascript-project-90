import { test, expect } from '../utils/fixtures.js'

test.describe('Users list tests', () => {

  test('Table should be visible', async ({ userPage, page }) => {
    await userPage.goto()
    await expect(page.getByText('Users').first()).toBeVisible({ timeout: 10000 })
    await expect(userPage.tableBody).toBeVisible()
  })

  test.describe('Table data', () => {
    let email, firstname, lastname

    test.beforeEach(async ({ userPage, testData }) => {
      await userPage.goto()
      email = testData.email
      firstname = testData.firstName
      lastname = testData.lastName
    })

    test('User data', async ({ userPage }) => {
      await userPage.checkItem(email, firstname, lastname)
    })

    test('Pagination', async ({ userPage }) => {
      const size = 5
      await userPage.setPageSize(size)
      await expect(userPage.tableRows).toHaveCount(size)
      await expect(userPage.paginationInfo).toHaveText(new RegExp(String.raw`1-${size} of \d+`))
    })
  })
})
