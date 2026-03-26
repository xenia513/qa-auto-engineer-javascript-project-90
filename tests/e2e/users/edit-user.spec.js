import { test, expect } from '../utils/fixtures.js'
import { faker } from '@faker-js/faker'

test.describe('User edit tests', () => {

  test('Update succeed', async ({ userPage, testUser }) => {
    await userPage.goto()
    const countBefore = await userPage.items.count()
    const email = faker.internet.email()
    const firstname = faker.person.firstName()
    const lastname = faker.person.lastName()
    const id = await userPage.getId(testUser.email)
    await userPage.gotoItem(id)
    await userPage.successEdit(email, firstname, lastname)
    await userPage.expectUpdateSuccess()
    await userPage.checkItem(email, firstname, lastname)
    await expect(userPage.getItem(testUser.email)).not.toBeVisible()
    await expect(userPage.items).toHaveCount(countBefore)
    })

  test.describe('Form UI tests', () => {

    test.beforeEach(async ({ userPage, testUser }) => {
      await userPage.goto()
      const id = await userPage.getId(testUser.email)
      await userPage.gotoItem(id)
    })
    
    test('Form elements should be visible', async ({ userPage }) => {
      await userPage.checkUIElements()
    })

    test('Invalid email', async ({ userPage }) => {
      await userPage.checkInvalidEmail()
    })

    test('Empty fields', async ({ userPage }) => {
      await userPage.checkEmptyFields()
    })
  })
})
