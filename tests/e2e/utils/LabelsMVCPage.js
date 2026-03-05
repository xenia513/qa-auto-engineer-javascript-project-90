import { expect } from '@playwright/test'

export default class LabelsMVCPage {
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
    this.emptyState = page.getByText('No Labels yet')
  }

  async goto() {
    await this.page.goto('/#/labels')
  }

  async gotoLabel(id) {
    await this.page.goto(`/#/labels/${id}`)
  }

  async expectLabelCount(count) {
    await expect(this.tableRows).toHaveCount(count)
  }

  getLabelByName(name) {
    return this.tableRows.filter({ hasText: name })
  }

  async checkLabelByName(name) {
    const row = this.getLabelByName(name)
    await expect(row).toBeVisible()
  }

  async selectLabelByName(name) {
    const row = this.getLabelByName(name)
    const checkbox = row.getByRole('checkbox')
    await checkbox.click()
    await expect(checkbox).toBeChecked()
  }

  async selectAllLabels() {
    const selectAllCheckbox = this.page.getByRole('checkbox').first()
    await selectAllCheckbox.click()
    await expect(selectAllCheckbox).toBeChecked()
    const checkboxes = this.tableRows.getByRole('checkbox')
    const count = await checkboxes.count()
    for (let i = 0; i < count; i++) {
        await expect(checkboxes.nth(i)).toBeChecked()
    }
  }

  async getLabelIdByName(name) {
    const row = this.getLabelByName(name)
    const idCell = row.locator('td').nth(1)
    return await idCell.innerText()
  }

  async setPageSize(size) {
    await this.pageSizeSelector.click()
    await this.page.getByRole('option', { name: size.toString(), exact: true }).click()
    await this.page.waitForLoadState('networkidle')
  }

  async checkDeleteLabel(name, id) {
      await expect(this.singleDeletePopup).toBeVisible()
      await expect(this.singleDeletePopup).toBeHidden()
      await expect(this.page).toHaveURL('/#/labels')
      await expect(this.getLabelByName(name)).not.toBeVisible()
      await this.gotoLabel(id)
      await expect(this.alert).toBeVisible()
  }
}
