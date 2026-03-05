import { test, expect } from '../utils/fixtures.js'
import { faker } from '@faker-js/faker'

test.describe('Label edit tests', () => {

  test.beforeEach(async ({ labelPage, labelsPage }) => {
    const name = faker.color.human()
    await labelPage.successCreate(name)
    await labelsPage.goto()
    const id = await labelsPage.getLabelIdByName(name)
    await labelsPage.gotoLabel(id)
    })
  
  test('Form elements should be visible', async ({ labelPage }) => {
    await labelPage.checkUIElements()
    await expect(labelPage.submitButton).toBeDisabled()
  })

  test('Update succeed', async ({ page, labelPage, labelsPage }) => {
    const name = faker.color.human()
    await labelPage.successEdit(name)
    await expect(page).toHaveURL('/#/labels')
    await expect(labelsPage.updatePopup).toBeVisible()
    await labelsPage.goto()
    await labelsPage.checkLabelByName(name)
    })

  test.describe('Update failed', () => {

    test('Empty fields', async ({ labelPage }) => {
      await labelPage.checkEmptyFields()
    })
  })
})
