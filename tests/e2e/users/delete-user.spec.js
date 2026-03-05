import { test, expect } from '../utils/fixtures.js'
import { faker } from '@faker-js/faker'

test.describe('User delete tests', () => {
    let id, email
    
  test.beforeEach(async ({ userPage, usersPage }) => {
    email = faker.internet.email()
    const firstname = faker.person.firstName()
    const lastname = faker.person.lastName()
    await userPage.successCreate(email, firstname, lastname)
    await usersPage.goto()
    id = await usersPage.getUsersIdByEmail(email)
  })

  test('Delete from user page', async ({ userPage, usersPage }) => {
    await usersPage.gotoUser(id)
    await userPage.deleteButton.click()
    await usersPage.checkDeleteUser(email, id)
  })

  test('Delete from users list', async ({ usersPage }) => {
    await usersPage.selectUserByEmail(email)
    await usersPage.deleteButton.click()
    await usersPage.checkDeleteUser(email, id)
  })

  test('Delete all users from users list', async ({ usersPage }) => {
    await usersPage.goto()
    await usersPage.selectAllUsers()
    await usersPage.deleteButton.click()
    await expect(usersPage.massDeletePopup).toBeVisible()
    await expect(usersPage.tableBody).not.toBeVisible()
    await expect(usersPage.emptyState).toBeVisible()
  })
})
