import { test, expect } from '@playwright/test'
import LoginMVCPage from '../utils/LoginMVCPage.js'

test.describe('Authorization tests', () => {
  let login
  const username = 'username'
  const password = 'password'

  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies()
    login = new LoginMVCPage(page)
    await login.goto()
  })

  test('Authorization succeed', async ({ page }) => {

    await login.fillUsername(username)
    await login.fillPassword(password)
    await login.clickSignInButton()
    await expect(page).not.toHaveURL(/.*login/)
    })

  test.describe('Authorization failed', () => {
    test('Empty username', async ({ page }) => {
      await login.fillPassword(password)
      await login.clickSignInButton()
      await expect(login.usernameInput).toHaveAttribute('aria-invalid', 'true')
      await expect(page.getByText('Required')).toBeVisible()
    })

    test('Empty password', async ({ page }) => {
      await login.fillUsername(username)
      await login.clickSignInButton()
      await expect(login.passwordInput).toHaveAttribute('aria-invalid', 'true')
      await expect(page.getByText('Required')).toBeVisible()
    })
  })
})