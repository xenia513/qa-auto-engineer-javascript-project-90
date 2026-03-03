import { test, expect } from '@playwright/test'
import LoginMVCPage from '../utils/LoginMVCPage.js'
import StatusMVCPage from '../utils/StatusMVCPage.js'
import StatusesMVCPage from '../utils/StatusesMVCPage.js'
import { faker } from '@faker-js/faker'

test.describe('Statuses list tests', () => {
  let status
  let statuses


  test.beforeEach(async ({ page }) => {
    const login = new LoginMVCPage(page)
    status = new StatusMVCPage(page)
    statuses = new StatusesMVCPage(page)
    await login.goto()
    await login.successAuth('username', 'password')
    await statuses.goto()
    })

  test('Table should be visible', async () => {
    await expect(statuses.tableBody).toBeVisible()
  })

  test.describe('Table data', () => {
    let id
    let name
    let slug

    test.beforeEach(async () => {
      name = faker.book.title()
      slug = faker.book.author()
      await status.successCreate(name, slug)
      await statuses.goto()
      id = await statuses.getStatusIdByName(name)
    })

    test('Status data', async () => {
      await statuses.checkStatusByName(name, slug)
    })

    test('Pagination', async () => {
      const size = 5
      await statuses.setPageSize(size)
      await expect(statuses.tableRows).toHaveCount(size)
      await expect(statuses.paginationInfo).toHaveText(`1-${size} of ${id}`)
    })
  })
})
