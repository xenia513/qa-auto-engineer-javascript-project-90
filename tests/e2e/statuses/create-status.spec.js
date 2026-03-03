import { test, expect } from '@playwright/test'
import LoginMVCPage from '../utils/LoginMVCPage.js'
import StatusMVCPage from '../utils/StatusMVCPage.js'
import StatusesMVCPage from '../utils/StatusesMVCPage.js'
import { faker } from '@faker-js/faker'

test.describe('Status create tests', () => {
  let status
  let statuses

  test.beforeEach(async ({ page }) => {
    const login = new LoginMVCPage(page)
    status = new StatusMVCPage(page)
    statuses = new StatusesMVCPage(page)
    await login.goto()
    await login.successAuth('username', 'password')
    })

  test('Form elements should be visible', async () => {
    await status.gotoCreate()
    await status.checkUIElements()
    await expect(status.submitButton).toBeDisabled()
  })

  test('Creation succeed', async () => {
    const name = faker.book.title()
    const slug = faker.book.author()
    await status.successCreate(name, slug)
    await expect(status.createPopup).toBeVisible()
    await statuses.goto()
    await statuses.checkStatusByName(name, slug)
    })

  test.describe('Creation failed', () => {

    test('Empty fields', async () => {
      await status.gotoCreate()
      await status.checkEmptyFields()
    })
  })
})
