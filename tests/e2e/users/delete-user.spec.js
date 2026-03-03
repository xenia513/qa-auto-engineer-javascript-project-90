import { test, expect } from '@playwright/test'
import LoginMVCPage from '../utils/LoginMVCPage.js'
import UserMVCPage from '../utils/UserMVCPage.js'
import UsersMVCPage from '../utils/UsersMVCPage.js'
import { faker } from '@faker-js/faker'

test.describe('Delete tests', () => {
  let user
  let users

  test.beforeEach(async ({ page }) => {
    const login = new LoginMVCPage(page)
    user = new UserMVCPage(page)
    users = new UsersMVCPage(page)
    await login.goto()
    await login.successAuth('username', 'password')
    })

  test.describe('Delete single user', () => {
    let userId
    let email
    
    test.beforeEach(async () => {
      email = faker.internet.email()
      const firstname = faker.person.firstName()
      const lastname = faker.person.lastName()
      await user.successCreate(email, firstname, lastname)
      await users.goto()
      userId = await users.getUsersIdByEmail(email)
    })

    test('Delete user from user page', async ({ page }) => {
      await user.gotoUser(userId)
      await user.deleteButton.click()
      await expect(page).toHaveURL('/#/users')
      await expect(users.singleDeletePopup).toBeVisible()
      await expect(users.singleDeletePopup).toBeHidden()
      await expect(page).toHaveURL('/#/users')
      await expect(users.getUserByEmail(email)).not.toBeVisible()
      await user.gotoUser(userId)
      await expect(users.alert).toBeVisible()
    })

    test('Delete user from users list', async ({ page }) => {
      await users.selectUserByEmail(email)
      await users.deleteButton.click()
      await expect(users.singleDeletePopup).toBeVisible()
      await expect(users.singleDeletePopup).toBeHidden()
      await expect(page).toHaveURL('/#/users')
      await expect(users.getUserByEmail(email)).not.toBeVisible()
      await user.gotoUser(userId)
      await expect(users.alert).toBeVisible()
    })
})

  test.describe('Mass delete', () => {

    test('Delete all users from users list', async () => {
      await users.goto()
      await users.selectAllUsers()
      await users.deleteButton.click()
      await expect(users.massDeletePopup).toBeVisible()
      await expect(users.tableBody).not.toBeVisible()
      await expect(users.emptyState).toBeVisible()
    })
  })
})
