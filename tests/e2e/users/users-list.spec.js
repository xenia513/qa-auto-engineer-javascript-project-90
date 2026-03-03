import { test, expect } from '@playwright/test'
import LoginMVCPage from '../utils/LoginMVCPage.js'
import UserMVCPage from '../utils/UserMVCPage.js'
import UsersMVCPage from '../utils/UsersMVCPage.js'
import { faker } from '@faker-js/faker'

test.describe('Users list tests', () => {
  let user
  let users


  test.beforeEach(async ({ page }) => {
    const login = new LoginMVCPage(page)
    user = new UserMVCPage(page)
    users = new UsersMVCPage(page)
    await login.goto()
    await login.successAuth('username', 'password')
    await users.goto()
    })

  test('Table should be visible', async () => {
    await expect(users.tableBody).toBeVisible()
  })

  test.describe('Table data', () => {
    let userId
    let email
    let firstname
    let lastname

    test.beforeEach(async () => {
      email = faker.internet.email()
      firstname = faker.person.firstName()
      lastname = faker.person.lastName()
      await user.successCreate(email, firstname, lastname)
      await users.goto()
      userId = await users.getUsersIdByEmail(email)
    })

    test('User data', async () => {
      await users.checkUserByEmail(email, firstname, lastname)
    })

    test('Pagination', async () => {
      const size = 5
      await users.setPageSize(size)
      await expect(users.tableRows).toHaveCount(size)
      await expect(users.paginationInfo).toHaveText(`1-${size} of ${userId}`)
    })
  })
})