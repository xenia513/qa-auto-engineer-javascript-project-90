import { test, expect } from '../utils/fixtures.js'
import { faker } from '@faker-js/faker'

test.describe('User create tests', () => {

  test('Form elements should be visible', async ({ userPage }) => {
    await userPage.gotoCreate()
    await userPage.checkUIElements()
    await expect(userPage.submitButton).toBeDisabled()
  })

  test('Creation succeed', async ({ userPage, usersPage }) => {
    const email = faker.internet.email()
    const firstname = faker.person.firstName()
    const lastname = faker.person.lastName()
    await userPage.successCreate(email, firstname, lastname)
    await expect(userPage.createPopup).toBeVisible()
    await usersPage.goto()
    await usersPage.checkUserByEmail(email, firstname, lastname)
    })

  test.describe('Creation failed', () => {
    test('Invalid email', async ({ userPage }) => {
      await userPage.gotoCreate()
      const errorMessage = 'Incorrect email format'
      await userPage.fillEmail('Incorrect email')
      await userPage.clickSubmitButton()
      await userPage.checkFieldError(userPage.emailInput, errorMessage)
      await expect(userPage.alert).toBeVisible()
    })

    test('Empty fields', async ({ userPage }) => {
      await userPage.gotoCreate()
      await userPage.checkEmptyFields()
    })
  })
})
