import { expect } from '@playwright/test'

export default class TasksMVCPage {
  /**
   * @param {Page} page
   */
  constructor(page) {
    this.page = page
    this.assigneeFilter = this.page.getByLabel('Assignee')
    this.statusFilter = this.page.getByLabel('Status')
    this.labelFilter = this.page.getByLabel('Label')
    this.taskCards = this.page.locator('[data-rfd-draggable-id]')
    this.createButton = page.getByLabel('Create')
    this.deletePopup = page.getByText('Element deleted')
    this.updatePopup = page.getByText('Element updated')
    this.alert = page.getByText('Element does not exist')
    this.emptyState = page.getByText('No Tasks yet')
  }

  async goto() {
    await this.page.goto('/#/tasks')
  }

  async gotoTaskById(id) {
    await this.page.goto(`/#/tasks/${id}`)
  }

  async filterByAssignee(assignee) {
    await this.assigneeFilter.click()
    await this.page.getByRole('option', { name: assignee, exact: true }).click()
    await this.page.waitForLoadState('networkidle')
  }

  getColumnByStatus(status) {
    return this.page.locator('div').filter({ has: this.page.locator(`h6:has-text("${status}")`) }).last()
  }

  async filterByStatus(status) {
    await this.statusFilter.click()
    await this.page.getByRole('option', { name: status, exact: true }).click()
    await this.page.waitForLoadState('networkidle')
  }

  async filterByLabel(label) {
    await this.labelFilter.click()
    await this.page.getByRole('option', { name: label, exact: true }).click()
    await this.page.waitForLoadState('networkidle')
  }

  async resetFilter(filter) {
    await this.page.getByLabel(filter).click()
    const clearOption = this.page.getByRole('option', { name: 'Clear value' })
    await clearOption.click()
    await expect(this.page.getByRole('listbox')).not.toBeVisible()
    await this.page.waitForLoadState('networkidle')
  }

  getTaskByTitle(title) {
    return this.page.locator('[data-rfd-draggable-id]').filter({ hasText: title })
  }
  
  async getTaskIdByTitle(title) {
    const task = this.getTaskByTitle(title)
    const id = await task.getAttribute('data-rfd-draggable-id')
    return id
  }
  
  async goToTaskEdit(title) {
    const task = this.getTaskByTitle(title)
    await task.locator('a[aria-label="Edit"]').click()
  }

  async goToTaskShow(title) {
    const task = this.getTaskByTitle(title)
    await task.locator('a[aria-label="Show"]').click()
  }

  async checkTaskByTitle(title, status, content = null) {
    const task = this.getTaskByTitle(title)
    await expect(task).toBeVisible()
    const column = this.page.locator(`h6:has-text("${status}")`).locator('..')
    await expect(column.locator(task)).toBeVisible()
    if (content) {
      await expect(task).toContainText(content)
    }
  }

  async checkDeleteTask(title, id) {
    await expect(this.deletePopup).toBeVisible()
    await expect(this.deletePopup).toBeHidden()
    await expect(this.page).toHaveURL('/#/tasks')
    await expect(this.getTaskByTitle(title)).not.toBeVisible()
    await this.gotoTaskById(id)
    await expect(this.alert).toBeVisible()
  }
}
