import { test } from '../utils/fixtures.js'
import { faker } from '@faker-js/faker'

test.describe('Status edit tests', () => {

  test.beforeEach(async ({ statusPage, testData }) => {
    await statusPage.goto()
    const id = await statusPage.getId(testData.status)
    await statusPage.gotoItem(id)
    })
  
  test('Form elements should be visible', async ({ statusPage }) => {
    await statusPage.checkUIElements()
  })

  test('Update succeed', async ({ statusPage }) => {
    const name = faker.book.title()
    const slug = faker.book.author()
    await statusPage.successEdit(name, slug)
    await statusPage.expectUpdateSuccess()
    await statusPage.checkItem(name, slug)
    })

  test.describe('Update failed', () => {

    test('Empty fields', async ({ statusPage }) => {
      await statusPage.checkEmptyFields()
    })
  })
})
