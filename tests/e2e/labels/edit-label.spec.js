import { test, expect } from '../utils/fixtures.js'

test.describe('Label edit tests', () => {

  test('Update succeed', async ({ labelPage, labelTestData, testLabel }) => {
    await labelPage.goto()
    const countBefore = await labelPage.items.count()
    const id = await labelPage.getId(testLabel.label)
    const label = `${labelTestData.label}-updated`
    await labelPage.gotoItem(id)
    await labelPage.successEdit(label)
    await labelPage.expectUpdateSuccess()
    await labelPage.checkItem(label)
    await expect(labelPage.getItem(testLabel.label)).not.toBeVisible()
    await expect(labelPage.items).toHaveCount(countBefore)
    })

  test.describe('Form UI tests', () => {
    
    test.beforeEach(async ({ labelPage, testLabel }) => {
      await labelPage.goto()
      const id = await labelPage.getId(testLabel.label)
      await labelPage.gotoItem(id)
    })
    
    test('Form elements should be visible', async ({ labelPage }) => {
      await labelPage.checkUIElements()
    })

    test('Empty fields', async ({ labelPage }) => {
      await labelPage.checkEmptyFields()
    })
  })
})
