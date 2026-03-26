import { test, expect } from '../utils/fixtures.js'

test.describe('Status create tests', () => {

  test('Form elements should be visible', async ({ statusPage }) => {
    await statusPage.gotoCreate()
    await statusPage.checkUIElements()
  })

  test('Creation succeed', async ({ statusPage, statusTestData }) => {
    await statusPage.goto({ timeout: 10000 })
    await expect(statusPage.items.first()).toBeVisible()
    const countBefore = await statusPage.items.count()
    const status = statusTestData.status
    const slug = statusTestData.slug
    await statusPage.successCreate(status, slug)
    await statusPage.checkItem(status, slug)
    await expect(statusPage.items).toHaveCount(countBefore + 1)
    })

  test.describe('Creation failed', () => {

    test('Empty fields', async ({ statusPage }) => {
      await statusPage.gotoCreate()
      await statusPage.checkEmptyFields()
    })
  })
})
