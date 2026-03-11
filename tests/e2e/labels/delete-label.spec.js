import { test } from '../utils/fixtures.js'

test.describe('Label delete tests', () => {
  let id, name, countBefore, countAfter

  test.beforeEach(async ({ labelPage, testData }) => {
    await labelPage.goto()
    name = testData.label
    id = await labelPage.getId(name)
    countBefore = await this.tableRows.count()
  })

  test('Delete from label page', async ({ labelPage }) => {
    await labelPage.gotoItem(id)
    await labelPage.deleteItem(name, id)
    countAfter = await this.tableRows.count()
    expect(countAfter).toBe(countBefore - 1)
  })

  test('Delete from labels list', async ({ labelPage }) => {
    
    await labelPage.selectItem(name)
    await labelPage.deleteItem(name, id)
    countAfter = await this.tableRows.count()
    expect(countAfter).toBe(countBefore - 1)
  })

  test('Delete all labels from labels list', async ({ labelPage }) => {
    await labelPage.deleteAll()
  })
})
