import { test } from '../utils/fixtures.js'
import { faker } from '@faker-js/faker'

test.describe('Label create tests', () => {

  test('Form elements should be visible', async ({ labelPage }) => {
    await labelPage.gotoCreate()
    await labelPage.checkUIElements()
  })

  test('Creation succeed', async ({ labelPage }) => {
    const name = faker.color.human()
    await labelPage.successCreate(name)
    await labelPage.checkItem(name)
    })

  test.describe('Creation failed', () => {

    test('Empty fields', async ({ labelPage }) => {
      await labelPage.gotoCreate()
      await labelPage.checkEmptyFields()
    })
  })
})
