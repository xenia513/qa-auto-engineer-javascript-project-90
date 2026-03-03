import { test, expect } from '@playwright/test'
import LoginMVCPage from '../utils/LoginMVCPage.js'
import LabelMVCPage from '../utils/LabelMVCPage.js'
import LabelsMVCPage from '../utils/LabelsMVCPage.js'
import { faker } from '@faker-js/faker'

test.describe('Label create tests', () => {
  let label
  let labels

  test.beforeEach(async ({ page }) => {
    const login = new LoginMVCPage(page)
    label = new LabelMVCPage(page)
    labels = new LabelsMVCPage(page)
    await login.goto()
    await login.successAuth('username', 'password')
    })

  test('Form elements should be visible', async () => {
    await label.gotoCreate()
    await label.checkUIElements()
    await expect(label.submitButton).toBeDisabled()
  })

  test('Creation succeed', async () => {
    const name = faker.color.human()
    await label.successCreate(name)
    await expect(label.createPopup).toBeVisible()
    await labels.goto()
    await labels.checkLabelByName(name)
    })

  test.describe('Creation failed', () => {

    test('Empty fields', async () => {
      await label.gotoCreate()
      await label.checkEmptyFields()
    })
  })
})
