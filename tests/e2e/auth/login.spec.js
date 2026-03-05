import { test, expect } from '../utils/fixtures.js'

test.describe('Authorization tests', () => {
  const username = 'username'
  const password = 'password'

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto()
  })

  test('Form elements should be visible', async ({ loginPage }) => {
    await loginPage.checkUIElements()
})

  test('Authorization succeed', async ({ page,loginPage }) => {
    await loginPage.successAuth(username, password)
    await expect(page.locator('h6')).toHaveText('Welcome to the administration')
    })

  test.describe('Authorization failed', () => {
    const errorMessage = 'Required'
    const fields = [
      { name: 'Username', key: 'usernameInput' },
      { name: 'Password', key: 'passwordInput' }
    ]

    for (const field of fields) {
      test(`Empty ${field.name}`, async ({ loginPage }) => {
        const inputLocator = loginPage[field.key]
        await inputLocator.fill('')
        await loginPage.clickSignInButton()
        await loginPage.checkFieldError(inputLocator, errorMessage)
        await expect(loginPage.alert).toBeVisible()
      })
    }
  })
})
