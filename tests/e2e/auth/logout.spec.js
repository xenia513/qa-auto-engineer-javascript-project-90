import { test, expect } from '@playwright/test'
import LoginMVCPage from '../utils/LoginMVCPage.js'

test.beforeEach(async ({ page, context }) => {
  await context.clearCookies()
  let login = new LoginMVCPage(page)
  await login.goto()
  await login.successAuth()
})

test('Logout', async ({ page }) => {
  await page.getByLabel('Profile').click()
  await page.getByRole('menuitem').filter({ hasText : 'Logout' }).click()
  await expect(page).toHaveURL('http://localhost:5173/#/login')
})