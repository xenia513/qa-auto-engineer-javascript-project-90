import { test } from '../utils/fixtures.js'

test.describe('User create tests', () => {
  
  test('Form elements should be visible', async ({ userPage }) => {
    await userPage.gotoCreate()
    await userPage.checkUIElements()
  })

  test('Creation succeed', async ({ userPage, userTestData }) => {
    const email = userTestData.email
    const firstname = userTestData.firstname
    const lastname = userTestData.lastname
    await userPage.successCreate(email, firstname, lastname)
    await userPage.checkItem(email, firstname, lastname)
    })

  test.describe('Creation failed', () => {
    test('Invalid email', async ({ userPage }) => {
      await userPage.gotoCreate()
      await userPage.checkInvalidEmail()
    })

    test('Empty fields', async ({ userPage }) => {
      await userPage.gotoCreate()
      await userPage.checkEmptyFields()
    })
  })
})
