import { test, expect } from '../utils/fixtures.js'
import { faker } from '@faker-js/faker'

test.describe('Status edit tests', () => {

  test.beforeEach(async ({ statusPage, statusesPage }) => {
    const name = faker.book.title()
    const slug = faker.book.author()
    await statusPage.successCreate(name, slug)
    await statusesPage.goto()
    const id = await statusesPage.getStatusIdByName(name)
    await statusesPage.gotoStatus(id)
    })
  
  test('Form elements should be visible', async ({ statusPage }) => {
    await statusPage.checkUIElements()
    await expect(statusPage.submitButton).toBeDisabled()
  })

  test('Update succeed', async ({ page, statusPage, statusesPage }) => {
    const name = faker.book.title()
    const slug = faker.book.author()
    await statusPage.successEdit(name, slug)
    await expect(page).toHaveURL('/#/task_statuses')
    await expect(statusesPage.updatePopup).toBeVisible()
    await statusesPage.goto()
    await statusesPage.checkStatusByName(name, slug)
    })

  test.describe('Update failed', () => {

    test('Empty fields', async ({ statusPage }) => {
      await statusPage.checkEmptyFields()
    })
  })
})
