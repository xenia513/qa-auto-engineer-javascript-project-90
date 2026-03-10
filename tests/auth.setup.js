import { test as setup, expect } from '@playwright/test'

const authFile = 'user.json'

setup('authenticate', async ({ page }) => {
  await page.goto('http://localhost:5173/#/login', { waitUntil: 'networkidle' })

  await page.getByLabel('Username').fill('username')
  await page.getByLabel('Password').fill('password')
  await page.getByRole('button', { name: /Sign in/i }).click()

  await expect(page).toHaveURL('http://localhost:5173/#/', { timeout: 50000 })
  await expect(page.locator('h6')).toHaveText('Welcome to the administration', { timeout: 15000 })
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)
  await page.context().storageState({ path: authFile })
})
