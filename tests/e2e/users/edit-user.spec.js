import { test, expect } from '../utils/fixtures.js'
import { faker } from '@faker-js/faker'

test.describe('User edit tests', () => {

  test.beforeEach(async ({ userPage, usersPage }) => {
    const email = faker.internet.email()
    const firstname = faker.person.firstName()
    const lastname = faker.person.lastName()
    await userPage.successCreate(email, firstname, lastname)
    await usersPage.goto()
    const id = await usersPage.getUsersIdByEmail(email)
    await usersPage.gotoUser(id)
    })
  
  test('Form elements should be visible', async ({ userPage }) => {
    await userPage.checkUIElements()
    await expect(userPage.submitButton).toBeDisabled()
  })

  test('Update succeed', async ({ page, userPage, usersPage }) => {
    const email = faker.internet.email()
    const firstname = faker.person.firstName()
    const lastname = faker.person.lastName()
    await userPage.successEdit(email, firstname, lastname)
    await expect(page).toHaveURL('/#/users')
    await expect(usersPage.updatePopup).toBeVisible()
    await usersPage.goto()
    await usersPage.checkUserByEmail(email, firstname, lastname)
    })

  test.describe('Update failed', () => {
    test('Invalid email', async ({ userPage }) => {
      const errorMessage = 'Incorrect email format'
      await userPage.fillEmail('Incorrect email')
      await userPage.clickSubmitButton()
      await userPage.checkFieldError(userPage.emailInput, errorMessage)
      await expect(userPage.alert).toBeVisible()
    })

    test('Empty fields', async ({ userPage }) => {
      await userPage.checkEmptyFields()
    })
  })
})
