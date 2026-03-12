import { test, expect } from '../utils/fixtures.js'

test.describe('User delete tests', () => {
    let id, email, countBefore, countAfter
    
  test.beforeEach(async ({ userPage, testData }) => {
    await userPage.goto()
    email = testData.email
    id = await userPage.getId(email)
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
    await expect(userPage.getItem(email)).toBeVisible()
  })

  test('Delete all users from users list', async ({ userPage }) => {
    await userPage.deleteAll()
  })
})
