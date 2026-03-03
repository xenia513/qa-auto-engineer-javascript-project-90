import { test, expect } from '@playwright/test'
import LoginMVCPage from '../utils/LoginMVCPage.js'

test.describe('Authorization tests', () => {
  let login
  const username = 'username'
  const password = 'password'

  test.beforeEach(async ({ page }) => {
    login = new LoginMVCPage(page)
    await login.goto()
  })

  test('Form elements should be visible', async () => {
    await login.checkUIElements()
})

  test('Authorization succeed', async ({ page }) => {
    await login.successAuth(username, password)
    await expect(page.locator('h6')).toHaveText('Welcome to the administration')
    })

  test.describe('Authorization failed', () => {
    const errorMessage = 'Required'
    const fields = [
      { name: 'Username', key: 'usernameInput' },
      { name: 'Password', key: 'passwordInput' }
    ]

    for (const field of fields) {
      test(`Empty ${field.name}`, async () => {
        const inputLocator = login[field.key]
        await inputLocator.fill('')
        await login.clickSignInButton()
        await login.checkFieldError(inputLocator, errorMessage)
        await expect(login.alert).toBeVisible()
      })
    }
  })
})
