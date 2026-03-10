import { test as setup, expect } from '@playwright/test'

const authFile = 'user.json'

setup('authenticate', async ({ page }) => {
  await page.goto('http://localhost:5173/#/login')
  if (await page.locator('text=Dashboard').isVisible()) {
    await page.context().storageState({ path: authFile })
    return;
  }
  await page.getByLabel('Username').fill('admin@email.com')
  await page.getByLabel('Password').fill('admin')
  await page.getByRole('button', { name: /Sign in/i }).click()

  await expect(page).toHaveURL('http://localhost:5173/#/', { timeout: 20000 })
  await page.waitForFunction(() => localStorage.length > 0)
  await page.waitForLoadState('networkidle')
  await expect(page.locator('h6')).toHaveText('Welcome to the administration', { timeout: 15000 })
  await page.context().storageState({ path: authFile })
})
