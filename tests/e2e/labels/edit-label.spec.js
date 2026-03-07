import { test } from '../utils/fixtures.js'
import { faker } from '@faker-js/faker'

test.describe('Label edit tests', () => {

  test.beforeEach(async ({ labelPage, testData }) => {
    await labelPage.goto()
    const id = await labelPage.getId(testData.label)
    await labelPage.gotoItem(id)
    })
  
  test('Form elements should be visible', async ({ labelPage }) => {
    await labelPage.checkUIElements()
  })

  test('Update succeed', async ({ page, labelPage }) => {
    const name = faker.color.human()
    await labelPage.successEdit(name)
    await labelPage.expectUpdateSuccess()
    await labelPage.checkItem(name)
    })

  test.describe('Update failed', () => {

    test('Empty fields', async ({ labelPage }) => {
      await labelPage.checkEmptyFields()
    })
  })
})
