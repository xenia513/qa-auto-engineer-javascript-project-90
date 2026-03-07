import { test } from '../utils/fixtures.js'

test.describe('User delete tests', () => {
    let id, email
    
  test.beforeEach(async ({ userPage, testData }) => {
    await userPage.goto()
    email = testData.email
    id = await userPage.getId(email)
  })

  test('Delete from user page', async ({ userPage }) => {
    await userPage.gotoItem(id)
    await userPage.deleteItem(email, id)
  })

  test('Delete from users list', async ({ userPage }) => {
    await userPage.selectItem(email)
    await userPage.deleteItem(email, id)
  })

  test('Delete all users from users list', async ({ userPage }) => {
    await userPage.deleteAll()
  })
})
