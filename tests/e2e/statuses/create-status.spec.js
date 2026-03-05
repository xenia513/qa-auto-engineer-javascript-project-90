import { test, expect } from '../utils/fixtures.js'
import { faker } from '@faker-js/faker'

test.describe('Status create tests', () => {

  test('Form elements should be visible', async ({ statusPage }) => {
    await statusPage.gotoCreate()
    await statusPage.checkUIElements()
    await expect(statusPage.submitButton).toBeDisabled()
  })

  test('Creation succeed', async ({ statusPage, statusesPage }) => {
    const name = faker.book.title()
    const slug = faker.book.author()
    await statusPage.successCreate(name, slug)
    await expect(statusPage.createPopup).toBeVisible()
    await statusesPage.goto()
    await statusesPage.checkStatusByName(name, slug)
    })

  test.describe('Creation failed', () => {

    test('Empty fields', async ({ statusPage }) => {
      await statusPage.gotoCreate()
      await statusPage.checkEmptyFields()
    })
  })
})
