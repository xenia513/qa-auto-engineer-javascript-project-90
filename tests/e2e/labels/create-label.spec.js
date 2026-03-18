import { test } from '../utils/fixtures.js'

test.describe('Label create tests', () => {

  test('Form elements should be visible', async ({ labelPage }) => {
    await labelPage.gotoCreate()
    await labelPage.checkUIElements()
  })

  test('Creation succeed', async ({ labelPage, labelTestData }) => {
    const label = labelTestData.label
    await labelPage.successCreate(label)
    await labelPage.checkItem(label)
    })

  test.describe('Creation failed', () => {

    test('Empty fields', async ({ labelPage }) => {
      await labelPage.gotoCreate()
      await labelPage.checkEmptyFields()
    })
  })
})
