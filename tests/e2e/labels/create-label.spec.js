import { test, expect } from '../utils/fixtures.js'

test.describe('Label create tests', () => {

  test('Form elements should be visible', async ({ labelPage }) => {
    await labelPage.gotoCreate()
    await labelPage.checkUIElements()
  })

  test('Creation succeed', async ({ labelPage, labelTestData }) => {
    await labelPage.goto({ timeout: 10000 })
    await expect(labelPage.items.first()).toBeVisible()
    const countBefore = await labelPage.items.count()
    const label = labelTestData.label
    await labelPage.successCreate(label)
    await labelPage.checkItem(label)
    await expect(labelPage.items).toHaveCount(countBefore + 1)
    })

  test.describe('Creation failed', () => {

    test('Empty fields', async ({ labelPage }) => {
      await labelPage.gotoCreate()
      await labelPage.checkEmptyFields()
    })
  })
})
