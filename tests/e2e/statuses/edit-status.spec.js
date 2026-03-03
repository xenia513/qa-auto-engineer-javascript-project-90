import { test, expect } from '@playwright/test'
import LoginMVCPage from '../utils/LoginMVCPage.js'
import StatusMVCPage from '../utils/StatusMVCPage.js'
import StatusesMVCPage from '../utils/StatusesMVCPage.js'
import { faker } from '@faker-js/faker'

test.describe('Status edit tests', () => {
  let status
  let statuses

  test.beforeEach(async ({ page }) => {
    const login = new LoginMVCPage(page)
    status = new StatusMVCPage(page)
    statuses = new StatusesMVCPage(page)
    await login.goto()
    await login.successAuth('username', 'password')
    const name = faker.book.title()
    const slug = faker.book.author()
    await status.successCreate(name, slug)
    await statuses.goto()
    const id = await statuses.getStatusIdByName(name)
    await status.gotoStatus(id)
    })
  
  test('Form elements should be visible', async () => {
    await status.checkUIElements()
    await expect(status.submitButton).toBeDisabled()
  })

  test('Update succeed', async ({ page }) => {
    const name = faker.book.title()
    const slug = faker.book.author()
    await status.successEdit(name, slug)
    await expect(page).toHaveURL('/#/task_statuses')
    await expect(statuses.updatePopup).toBeVisible()
    await statuses.goto()
    await statuses.checkStatusByName(name, slug)
    })

  test.describe('Update failed', () => {

    test('Empty fields', async () => {
      await status.checkEmptyFields()
    })
  })
})
