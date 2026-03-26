import { test, expect } from '../utils/fixtures.js'

test.describe('Status edit tests', () => {

  test('Update succeed', async ({ statusPage, statusTestData, testStatus }) => {
    await statusPage.goto()
    const countBefore = await statusPage.items.count()
    const id = await statusPage.getId(testStatus.status)
    const status = `${statusTestData.status}-updated`
    const slug = `${statusTestData.slug}-updated`
    await statusPage.gotoItem(id)
    await statusPage.successEdit(status, slug)
    await statusPage.expectUpdateSuccess()
    await statusPage.checkItem(status, slug)
    await expect(statusPage.getItem(testStatus.status)).not.toBeVisible()
    await expect(statusPage.items).toHaveCount(countBefore)
    })

  test.describe('Form UI tests', () => {
    
    test.beforeEach(async ({ statusPage, testStatus }) => {
      await statusPage.goto()
      const id = await statusPage.getId(testStatus.status)
      await statusPage.gotoItem(id)
    })
    
    test('Form elements should be visible', async ({ statusPage }) => {
      await statusPage.checkUIElements()
    })

    test('Empty fields', async ({ statusPage }) => {
      await statusPage.checkEmptyFields()
    })
  })
})
