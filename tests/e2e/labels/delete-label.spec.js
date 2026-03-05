import { test, expect } from '../utils/fixtures.js'
import { faker } from '@faker-js/faker'

test.describe('Label delete tests', () => {
  let id, name

  test.beforeEach(async ({ labelPage, labelsPage }) => {
    name = faker.color.human()
    await labelPage.successCreate(name)
    await labelsPage.goto()
    id = await labelsPage.getLabelIdByName(name)
  })

  test('Delete from label page', async ({ labelPage, labelsPage }) => {
    await labelsPage.gotoLabel(id)
    await labelPage.deleteButton.click()
    await labelsPage.checkDeleteLabel(name, id)
  })

  test('Delete from labels list', async ({ labelsPage }) => {
    await labelsPage.selectLabelByName(name)
    await labelsPage.deleteButton.click()
    await labelsPage.checkDeleteLabel(name, id)
  })

  test('Delete all labels from labels list', async ({ labelsPage }) => {
    await labelsPage.goto()
    await labelsPage.selectAllLabels()
    await labelsPage.deleteButton.click()
    await expect(labelsPage.massDeletePopup).toBeVisible()
    await expect(labelsPage.tableBody).not.toBeVisible()
    await expect(labelsPage.emptyState).toBeVisible()
  })
})
