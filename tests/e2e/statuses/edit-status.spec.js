import { test } from '../utils/fixtures.js'

test.describe('Status edit tests', () => {

  test.beforeEach(async ({ statusPage, testStatus }) => {
    await statusPage.goto()
    const id = await statusPage.getId(testStatus.status)
    await statusPage.gotoItem(id)
    })
  
  test('Form elements should be visible', async ({ statusPage }) => {
    await statusPage.checkUIElements()
  })

  test('Update succeed', async ({ statusPage, statusTestData }) => {
    const status = `${statusTestData.status}-updated`
    const slug = `${statusTestData.slug}-updated`
    await statusPage.successEdit(status, slug)
    await statusPage.expectUpdateSuccess()
    await statusPage.checkItem(status, slug)
    })

  test.describe('Update failed', () => {

    test('Empty fields', async ({ statusPage }) => {
      await statusPage.checkEmptyFields()
    })
  })
})
