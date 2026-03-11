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

  test('Delete from users list', async ({ userPage }) => {
    await userPage.selectItem(email)
    await userPage.deleteItem(email, id)
    countAfter = await userPage.items.count()
    await expect(countAfter).toBe(countBefore - 1)
  })

  test('Delete all users from users list', async ({ userPage }) => {
    await userPage.setPageSize(50)
    await userPage.deleteAll()
  })
})
