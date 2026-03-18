import { test, expect } from '../utils/fixtures.js'

test.describe('Users list tests', () => {

  test('Table should be visible', async ({ userPage, page }) => {
    await userPage.goto()
    await expect(page.getByText('Users').first()).toBeVisible({ timeout: 10000 })
    await expect(userPage.tableBody).toBeVisible()
  })

  test.describe('Table data', () => {
    let email, firstname, lastname

    test.beforeEach(async ({ userPage, testUser }) => {
      await userPage.goto()
      email = testUser.email
      firstname = testUser.firstName
      lastname = testUser.lastName
    })

    test('User data', async ({ userPage }) => {
      await userPage.checkItem(email, firstname, lastname)
    })

    test('Pagination', async ({ userPage }) => {
      await userPage.checkPagination()
    })
  })
})
