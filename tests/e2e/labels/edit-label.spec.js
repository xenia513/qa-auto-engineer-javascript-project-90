import { test, expect } from '@playwright/test'
import LoginMVCPage from '../utils/LoginMVCPage.js'
import LabelMVCPage from '../utils/LabelMVCPage.js'
import LabelsMVCPage from '../utils/LabelsMVCPage.js'
import { faker } from '@faker-js/faker'

test.describe('Label edit tests', () => {
  let label
  let labels

  test.beforeEach(async ({ page }) => {
    const login = new LoginMVCPage(page)
    label = new LabelMVCPage(page)
    labels = new LabelsMVCPage(page)
    await login.goto()
    await login.successAuth('username', 'password')
    const name = faker.color.human()
    await label.successCreate(name)
    await labels.goto()
    const id = await labels.getLabelIdByName(name)
    await label.gotoLabel(id)
    })
  
  test('Form elements should be visible', async () => {
    await label.checkUIElements()
    await expect(label.submitButton).toBeDisabled()
  })

  test('Update succeed', async ({ page }) => {
    const name = faker.color.human()
    await label.successEdit(name)
    await expect(page).toHaveURL('/#/labels')
    await expect(labels.updatePopup).toBeVisible()
    await labels.goto()
    await labels.checkLabelByName(name)
    })

  test.describe('Update failed', () => {

    test('Empty fields', async () => {
      await label.checkEmptyFields()
    })
  })
})
