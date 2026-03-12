import { test } from '../utils/fixtures.js'
import { faker } from '@faker-js/faker'

test.describe('User edit tests', () => {

  test.beforeEach(async ({ userPage, testData }) => {
    await userPage.goto()
    const id = await userPage.getId(testData.email)
    await userPage.gotoItem(id)
    })
  
  test('Form elements should be visible', async ({ userPage }) => {
    await userPage.checkUIElements()
  })

  test('Update succeed', async ({ userPage }) => {
    const email = faker.internet.email()
    const firstname = faker.person.firstName()
    const lastname = faker.person.lastName()
    await userPage.successEdit(email, firstname, lastname)
    await userPage.expectUpdateSuccess()
    await userPage.checkItem(email, firstname, lastname)
    })

  test.describe('Update failed', () => {
    test('Invalid email', async ({ userPage }) => {
      await userPage.checkInvalidEmail()
    })

    test('Empty fields', async ({ userPage }) => {
      await userPage.checkEmptyFields()
    })
  })
})
