import { test, expect } from '@playwright/test'
import LoginMVCPage from '../utils/LoginMVCPage.js'
import LabelMVCPage from '../utils/LabelMVCPage.js'
import LabelsMVCPage from '../utils/LabelsMVCPage.js'
import { faker } from '@faker-js/faker'

test.describe('Delete tests', () => {
  let label
  let labels

  test.beforeEach(async ({ page }) => {
    const login = new LoginMVCPage(page)
    label = new LabelMVCPage(page)
    labels = new LabelsMVCPage(page)
    await login.goto()
    await login.successAuth('username', 'password')
    })

  test.describe('Delete single label', () => {
    let id
    let name
    
    test.beforeEach(async () => {
      name = faker.color.human()
      await label.successCreate(name)
      await labels.goto()
      id = await labels.getLabelIdByName(name)
    })

    test('Delete label from label page', async ({ page }) => {
      await label.gotoLabel(id)
      await label.deleteButton.click()
      await expect(page).toHaveURL('/#/labels')
      await expect(labels.singleDeletePopup).toBeVisible()
      await expect(labels.singleDeletePopup).toBeHidden()
      await expect(page).toHaveURL('/#/labels')
      await expect(labels.getLabelByName(name)).not.toBeVisible()
      await label.gotoLabel(id)
      await expect(labels.alert).toBeVisible()
    })

    test('Delete label from labels list', async ({ page }) => {
      await labels.selectLabelByName(name)
      await labels.deleteButton.click()
      await expect(labels.singleDeletePopup).toBeVisible()
      await expect(labels.singleDeletePopup).toBeHidden()
      await expect(page).toHaveURL('/#/labels')
      await expect(labels.getLabelByName(name)).not.toBeVisible()
      await label.gotoLabel(id)
      await expect(labels.alert).toBeVisible()
    })
})

  test.describe('Mass delete', () => {

    test('Delete all labels from labels list', async () => {
      await labels.goto()
      await labels.selectAllLabels()
      await labels.deleteButton.click()
      await expect(labels.massDeletePopup).toBeVisible()
      await expect(labels.tableBody).not.toBeVisible()
      await expect(labels.emptyState).toBeVisible()
    })
  })
})
