import { test as setup, expect } from '@playwright/test'

const authFile = 'playwright/.auth/user.json'

setup('authenticate', async ({ page }) => {
  await page.goto('http://localhost:5173/#/login')

  await page.getByLabel('Username').fill('username')
  await page.getByLabel('Password').fill('password')
  
  await page.getByRole('button', { name: /Sign in/i }).click()

  await expect(page).toHaveURL('http://localhost:5173/#/')

  await page.context().storageState({ path: authFile })
});