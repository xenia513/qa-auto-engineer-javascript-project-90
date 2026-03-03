import { test, expect } from '@playwright/test'
import LoginMVCPage from '../utils/LoginMVCPage.js'
import UserMVCPage from '../utils/UserMVCPage.js'
import UsersMVCPage from '../utils/UsersMVCPage.js'
import { faker } from '@faker-js/faker'

test.describe('User create tests', () => {
  let user
  let users

  test.beforeEach(async ({ page }) => {
    const login = new LoginMVCPage(page)
    user = new UserMVCPage(page)
    users = new UsersMVCPage(page)
    await login.goto()
    await login.successAuth('username', 'password')
    })

  test('Form elements should be visible', async () => {
    await user.gotoCreate()
    await user.checkUIElements()
    await expect(user.submitButton).toBeDisabled()
  })

  test('Creation succeed', async () => {
    const email = faker.internet.email()
    const firstname = faker.person.firstName()
    const lastname = faker.person.lastName()
    await user.successCreate(email, firstname, lastname)
    await expect(user.createPopup).toBeVisible()
    await users.goto()
    await users.checkUserByEmail(email, firstname, lastname)
    })

  test.describe('Creation failed', () => {
    test('Invalid email', async () => {
      await user.gotoCreate()
      const errorMessage = 'Incorrect email format'
      await user.fillEmail('Incorrect email')
      await user.clickSubmitButton()
      await user.checkFieldError(user.emailInput, errorMessage)
      await expect(user.alert).toBeVisible()
    })

    test('Empty fields', async () => {
      await user.gotoCreate()
      await user.checkEmptyFields()
    })
  })
})
