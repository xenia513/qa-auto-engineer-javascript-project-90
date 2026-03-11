import { test, expect } from '../utils/fixtures.js'

test.describe('Authorization tests', () => {
  const username = 'username'
  const password = '1234' // NOSONAR

  test.beforeEach(async ({ page, loginPage, context }) => {
    await context.clearCookies()
    await page.goto(loginPage.url)
  })

  test('Form elements should be visible', async ({ loginPage }) => {
    await loginPage.checkUIElements()
})

  test('Authorization succeed', async ({ page,loginPage }) => {
    await loginPage.successAuth(username, password)
    await expect(page.locator('h6')).toHaveText('Welcome to the administration')
    })

  test.describe('Authorization failed', () => {

    test('Empty fields', async ({ loginPage }) => {
      await loginPage.checkEmptyFields()
    })
  })
})
