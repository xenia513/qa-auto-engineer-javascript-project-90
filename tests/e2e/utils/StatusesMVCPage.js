import { expect } from '@playwright/test'

export default class StatusesMVCPage {
  /**
   * @param {Page} page
   */
  constructor(page) {
    this.page = page
    this.tableBody = page.locator('tbody')
    this.tableRows = page.locator('tbody tr')
    this.createButton = page.getByLabel('Create')
    this.deleteButton = page.getByRole('button', { name: 'Delete' })
    this.singleDeletePopup = page.getByText('Element deleted')
    this.massDeletePopup = page.getByText('elements deleted')
    this.updatePopup = page.getByText('Element updated')
    this.pageSizeSelector = page.locator('.MuiTablePagination-select')
    this.paginationInfo = page.locator('.MuiTablePagination-displayedRows')
    this.alert = page.getByText('Element does not exist')
    this.emptyState = page.getByText('No Task statuses yet')
  }

  async goto() {
    await this.page.goto('/#/task_statuses')
  }

  async gotoStatus(id) {
    await this.page.goto(`/#/task_statuses/${id}`)
  }

  async expectStatusCount(count) {
    await expect(this.tableRows).toHaveCount(count)
  }

  getStatusByName(name) {
    return this.tableRows.filter({ hasText: name })
  }

  async checkStatusByName(name, slug) {
    const row = this.getStatusByName(name)
    await expect(row).toBeVisible()
    await expect(row).toContainText(slug)
  }

  async selectStatusByName(name) {
    const row = this.getStatusByName(name)
    const checkbox = row.getByRole('checkbox')
    await checkbox.click()
    await expect(checkbox).toBeChecked()
  }

  async selectAllStatuses() {
    const selectAllCheckbox = this.page.getByRole('checkbox').first()
    await selectAllCheckbox.click()
    await expect(selectAllCheckbox).toBeChecked()
    const checkboxes = this.tableRows.getByRole('checkbox')
    const count = await checkboxes.count()
    for (let i = 0; i < count; i++) {
        await expect(checkboxes.nth(i)).toBeChecked()
    }
  }

  async getStatusIdByName(name) {
    const row = this.getStatusByName(name)
    const idCell = row.locator('td').nth(1)
    return await idCell.innerText()
  }

  async setPageSize(size) {
    await this.pageSizeSelector.click()
    await this.page.getByRole('option', { name: size.toString(), exact: true }).click()
    await this.page.waitForLoadState('networkidle')
  }

  async checkDeleteStatus(name, id) {
      await expect(this.singleDeletePopup).toBeVisible()
      await expect(this.singleDeletePopup).toBeHidden()
      await expect(this.page).toHaveURL('/#/task_statuses')
      await expect(this.getStatusByName(name)).not.toBeVisible()
      await this.gotoStatus(id)
      await expect(this.alert).toBeVisible()
  }
}
