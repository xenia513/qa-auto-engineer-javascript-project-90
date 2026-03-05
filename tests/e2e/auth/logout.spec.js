import { test, expect } from '../utils/fixtures.js'

test('Logout test', async ({ loggedPage }) => {
  await loggedPage.getByLabel('Profile').click()
  await loggedPage.getByRole('menuitem').filter({ hasText : 'Logout' }).click()
  await expect(loggedPage).toHaveURL('/#/login')
})
