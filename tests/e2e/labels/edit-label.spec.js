import { test } from '../utils/fixtures.js'

test.describe('Label edit tests', () => {

  test.beforeEach(async ({ labelPage, testLabel }) => {
    await labelPage.goto()
    const id = await labelPage.getId(testLabel.label)
    await labelPage.gotoItem(id)
    })
  
  test('Form elements should be visible', async ({ labelPage }) => {
    await labelPage.checkUIElements()
  })

  test('Update succeed', async ({ labelPage, labelTestData }) => {
    const label = `${labelTestData.label}-updated`
    await labelPage.successEdit(label)
    await labelPage.expectUpdateSuccess()
    await labelPage.checkItem(label)
    })

  test.describe('Update failed', () => {

    test('Empty fields', async ({ labelPage }) => {
      await labelPage.checkEmptyFields()
    })
  })
})
