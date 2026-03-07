import { test } from '../utils/fixtures.js'
import { faker } from '@faker-js/faker'

test.describe('Status create tests', () => {

  test('Form elements should be visible', async ({ statusPage }) => {
    await statusPage.gotoCreate()
    await statusPage.checkUIElements()
  })

  test('Creation succeed', async ({ statusPage }) => {
    const name = faker.book.title()
    const slug = faker.lorem.slug()
    await statusPage.successCreate(name, slug)
    await statusPage.checkItem(name, slug)
    })

  test.describe('Creation failed', () => {

    test('Empty fields', async ({ statusPage }) => {
      await statusPage.gotoCreate()
      await statusPage.checkEmptyFields()
    })
  })
})
