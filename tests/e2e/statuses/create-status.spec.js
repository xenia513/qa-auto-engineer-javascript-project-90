import { test } from '../utils/fixtures.js'

test.describe('Status create tests', () => {

  test('Form elements should be visible', async ({ statusPage }) => {
    await statusPage.gotoCreate()
    await statusPage.checkUIElements()
  })

  test('Creation succeed', async ({ statusPage, statusTestData }) => {
    const status = statusTestData.status
    const slug = statusTestData.slug
    await statusPage.successCreate(status, slug)
    await statusPage.checkItem(status, slug)
    })

  test.describe('Creation failed', () => {

    test('Empty fields', async ({ statusPage }) => {
      await statusPage.gotoCreate()
      await statusPage.checkEmptyFields()
    })
  })
})
