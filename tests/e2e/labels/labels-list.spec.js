import { test, expect } from '../utils/fixtures.js'
import { faker } from '@faker-js/faker'

test.describe('Labels list tests', () => {

  test('Table should be visible', async ({ labelsPage }) => {
    await labelsPage.goto()
    await expect(labelsPage.tableBody).toBeVisible()
  })

  test.describe('Table data', () => {
    let id, name

    test.beforeEach(async ({ labelPage, labelsPage }) => {
      name = faker.book.title()
      await labelPage.successCreate(name)
      await labelsPage.goto()
      id = await labelsPage.getLabelIdByName(name)
    })

    test('Label data', async ({ labelsPage }) => {
      await labelsPage.checkLabelByName(name)
    })

    test('Pagination', async ({ labelsPage }) => {
      const size = 5
      await labelsPage.setPageSize(size)
      await expect(labelsPage.tableRows).toHaveCount(size)
      await expect(labelsPage.paginationInfo).toHaveText(`1-${size} of ${id}`)
    })
  })
})
