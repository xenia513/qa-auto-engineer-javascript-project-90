import { test, expect } from '@playwright/test'
import LoginMVCPage from '../utils/LoginMVCPage.js'

let login

test.beforeEach(async ({ page }) => {
  login = new LoginMVCPage(page)
  await login.goto()
  await login.successAuth('username', 'password')
})

test('Logout test', async ({ page }) => {
  await page.getByLabel('Profile').click()
  await page.getByRole('menuitem').filter({ hasText : 'Logout' }).click()
  await expect(page).toHaveURL('/#/login')
})