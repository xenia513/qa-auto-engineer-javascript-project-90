import { expect } from '@playwright/test'

export default class UsersMVCPage {
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
    this.emptyState = page.getByText('No Users yet')
  }

  async goto() {
    await this.page.goto('/#/users')
  }

  async expectUserCount(count) {
    await expect(this.tableRows).toHaveCount(count)
  }

  getUserByEmail(email) {
    return this.tableRows.filter({ hasText: email })
  }

  async checkUserByEmail(email, firstname, lastname) {
    const row = this.getUserByEmail(email)
    await expect(row).toBeVisible()
    await expect(row).toContainText(firstname)
    await expect(row).toContainText(lastname)
  }

  async selectUserByEmail(email) {
    const row = this.getUserByEmail(email)
    const checkbox = row.getByRole('checkbox')
    await checkbox.click()
    await expect(checkbox).toBeChecked()
  }

  async selectAllUsers() {
    const selectAllCheckbox = this.page.getByRole('checkbox').first()
    await selectAllCheckbox.click()
    await expect(selectAllCheckbox).toBeChecked()
    const checkboxes = this.tableRows.getByRole('checkbox')
    const count = await checkboxes.count()
    for (let i = 0; i < count; i++) {
        await expect(checkboxes.nth(i)).toBeChecked()
    }
  }

  async getUsersIdByEmail(email) {
    const row = this.getUserByEmail(email)
    const idCell = row.locator('td').nth(1)
    return await idCell.innerText()
  }

  async setPageSize(size) {
    await this.pageSizeSelector.click()
    await this.page.getByRole('option', { name: size.toString(), exact: true }).click()
    await this.page.waitForLoadState('networkidle')
  }
}

