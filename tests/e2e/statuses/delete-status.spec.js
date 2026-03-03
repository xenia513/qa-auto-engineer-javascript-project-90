import { test, expect } from '@playwright/test'
import LoginMVCPage from '../utils/LoginMVCPage.js'
import StatusMVCPage from '../utils/StatusMVCPage.js'
import StatusesMVCPage from '../utils/StatusesMVCPage.js'
import { faker } from '@faker-js/faker'

test.describe('Delete tests', () => {
  let status
  let statuses

  test.beforeEach(async ({ page }) => {
    const login = new LoginMVCPage(page)
    status = new StatusMVCPage(page)
    statuses = new StatusesMVCPage(page)
    await login.goto()
    await login.successAuth('username', 'password')
    })

  test.describe('Delete single status', () => {
    let id
    let name
    
    test.beforeEach(async () => {
      name = faker.book.title()
      const slug = faker.book.author()
      await status.successCreate(name, slug)
      await statuses.goto()
      id = await statuses.getStatusIdByName(name)
    })

    test('Delete status from status page', async ({ page }) => {
      await status.gotoStatus(id)
      await status.deleteButton.click()
      await expect(page).toHaveURL('/#/task_statuses')
      await expect(statuses.singleDeletePopup).toBeVisible()
      await expect(statuses.singleDeletePopup).toBeHidden()
      await expect(page).toHaveURL('/#/task_statuses')
      await expect(statuses.getStatusByName(name)).not.toBeVisible()
      await status.gotoStatus(id)
      await expect(statuses.alert).toBeVisible()
    })

    test('Delete status from statuses list', async ({ page }) => {
      await statuses.selectStatusByName(name)
      await statuses.deleteButton.click()
      await expect(statuses.singleDeletePopup).toBeVisible()
      await expect(statuses.singleDeletePopup).toBeHidden()
      await expect(page).toHaveURL('/#/task_statuses')
      await expect(statuses.getStatusByName(name)).not.toBeVisible()
      await status.gotoStatus(id)
      await expect(statuses.alert).toBeVisible()
    })
})

  test.describe('Mass delete', () => {

    test('Delete all statuses from statuses list', async () => {
      await statuses.goto()
      await statuses.selectAllStatuses()
      await statuses.deleteButton.click()
      await expect(statuses.massDeletePopup).toBeVisible()
      await expect(statuses.tableBody).not.toBeVisible()
      await expect(statuses.emptyState).toBeVisible()
    })
  })
})
