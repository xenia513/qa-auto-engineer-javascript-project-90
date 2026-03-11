import { test, expect } from '../utils/fixtures.js'

test('Logout test', async ({ loggedPage, page }) => {
  await loggedPage.getByLabel('Profile').click()
  await loggedPage.getByRole('menuitem').filter({ hasText : 'Logout' }).click()
  await expect(page).toHaveURL('/#/login')
})
