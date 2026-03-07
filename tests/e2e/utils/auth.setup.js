import { test as setup, expect } from './fixtures.js'

const authFile = 'playwright/.auth/user.json'

setup('authenticate', async ({ loginPage, page }) => {
  await page.goto(loginPage.url)
  await loginPage.successAuth('username', 'password')
  await page.waitForURL('/#/')
  await page.waitForLoadState('networkidle')
  await expect(page.getByLabel('Profile')).toBeVisible()
  await page.context().storageState({ path: authFile })
})