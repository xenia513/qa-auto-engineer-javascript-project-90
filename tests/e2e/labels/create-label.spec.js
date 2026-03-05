import { test, expect } from '../utils/fixtures.js'
import { faker } from '@faker-js/faker'

test.describe('Label create tests', () => {

  test('Form elements should be visible', async ({ labelPage }) => {
    await labelPage.gotoCreate()
    await labelPage.checkUIElements()
    await expect(labelPage.submitButton).toBeDisabled()
  })

  test('Creation succeed', async ({ labelPage, labelsPage }) => {
    const name = faker.color.human()
    await labelPage.successCreate(name)
    await expect(labelPage.createPopup).toBeVisible()
    await labelsPage.goto()
    await labelsPage.checkLabelByName(name)
    })

  test.describe('Creation failed', () => {

    test('Empty fields', async ({ labelPage }) => {
      await labelPage.gotoCreate()
      await labelPage.checkEmptyFields()
    })
  })
})
