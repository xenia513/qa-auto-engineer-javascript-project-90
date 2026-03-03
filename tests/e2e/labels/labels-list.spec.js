import { test, expect } from '@playwright/test'
import LoginMVCPage from '../utils/LoginMVCPage.js'
import LabelMVCPage from '../utils/LabelMVCPage.js'
import LabelsMVCPage from '../utils/LabelsMVCPage.js'
import { faker } from '@faker-js/faker'

test.describe('Labels list tests', () => {
  let label
  let labels


  test.beforeEach(async ({ page }) => {
    const login = new LoginMVCPage(page)
    label = new LabelMVCPage(page)
    labels = new LabelsMVCPage(page)
    await login.goto()
    await login.successAuth('username', 'password')
    await labels.goto()
    })

  test('Table should be visible', async () => {
    await expect(labels.tableBody).toBeVisible()
  })

  test.describe('Table data', () => {
    let id
    let name

    test.beforeEach(async () => {
      name = faker.book.title()
      await label.successCreate(name)
      await labels.goto()
      id = await labels.getLabelIdByName(name)
    })

    test('Label data', async () => {
      await labels.checkLabelByName(name)
    })

    test('Pagination', async () => {
      const size = 5
      await labels.setPageSize(size)
      await expect(labels.tableRows).toHaveCount(size)
      await expect(labels.paginationInfo).toHaveText(`1-${size} of ${id}`)
    })
  })
})
