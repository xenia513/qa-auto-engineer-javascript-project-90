import { test, expect } from '../utils/fixtures.js'
import { faker } from '@faker-js/faker'

test.describe('Users list tests', () => {

  test('Table should be visible', async ({ usersPage }) => {
    await usersPage.goto()
    await expect(usersPage.tableBody).toBeVisible()
  })

  test.describe('Table data', () => {
    let id, email, firstname, lastname

    test.beforeEach(async ({ userPage, usersPage }) => {
      email = faker.internet.email()
      firstname = faker.person.firstName()
      lastname = faker.person.lastName()
      await userPage.successCreate(email, firstname, lastname)
      await usersPage.goto()
      id = await usersPage.getUsersIdByEmail(email)
    })

    test('User data', async ({ usersPage }) => {
      await usersPage.checkUserByEmail(email, firstname, lastname)
    })

    test('Pagination', async ({ usersPage }) => {
      const size = 5
      await usersPage.setPageSize(size)
      await expect(usersPage.tableRows).toHaveCount(size)
      await expect(usersPage.paginationInfo).toHaveText(`1-${size} of ${id}`)
    })
  })
})
