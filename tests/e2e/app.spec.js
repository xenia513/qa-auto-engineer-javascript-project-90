// @ts-check
import { test, expect } from '@playwright/test'

test('приложение успешно рендерится', async ({ page }) => {
  await page.goto('http://localhost:5173')

  await expect(page).toHaveURL('http://localhost:5173/#/login')

  const loginIcon = page.getByTestId('LockIcon')
  await expect(loginIcon).toBeVisible()

  const signInButton = page.getByRole('button', { name: 'Sign in' })
  await expect(signInButton).toBeVisible()

  const usernameInput = page.getByLabel('Username')
  await expect(usernameInput).toBeVisible()

  const passwordInput = page.getByLabel('Password')
  await expect(passwordInput).toBeVisible()
})

