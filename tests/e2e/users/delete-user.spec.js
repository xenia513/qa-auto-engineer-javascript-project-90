import { test, expect } from '../utils/fixtures.js'

test.describe('User delete tests', () => {
    let id, email, item, countBefore, countAfter
    
  test.beforeEach(async ({ userPage, testUser }) => {
    await userPage.goto()
    email = testUser.email
    id = await userPage.getId(email)
    item = userPage.getItem(email)
    await expect(item).toBeVisible()
    countBefore = await userPage.items.count()
  })

  test('Delete from user page', async ({ userPage }) => {
    await userPage.gotoItem(id)
    await userPage.deleteItem(email, id)
    countAfter = await userPage.items.count()
    await expect(countAfter).toBe(countBefore - 1)
  })

  test('Undo deletion from users list', async ({ userPage }) => {
    await userPage.selectItem(email)
    await userPage.deleteButton.click({ force: true })
    await userPage.undoButton.click()
    await expect(userPage.deletePopup).toBeHidden()
    await expect(userPage.items).toHaveCount(countBefore)
    await expect(item).toBeVisible()
  })

  test('Delete all users from users list', async ({ userPage }) => {
    await userPage.deleteAll()
  })
})
