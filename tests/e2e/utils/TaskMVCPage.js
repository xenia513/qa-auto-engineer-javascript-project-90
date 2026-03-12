import { expect } from '@playwright/test'
import BaseMVCPage from './BaseMVCPage.js'

export default class TaskMVCPage extends BaseMVCPage {
  /**
   * @param {Page} page
   */
  constructor(page) {
    super(page)
    this.url = '/#/tasks'    
    this.emptyText = 'No Tasks yet'
    this.itemLocator = '[data-rfd-draggable-id]'

    this.assigneeSelect = page.getByLabel('Assignee')
    this.titleInput = page.getByLabel('Title')
    this.contentInput = page.locator('textarea[name="content"]')
    this.statusSelect = page.getByLabel('Status')
    this.labelSelect = page.getByLabel('Label')

    this.assigneeField = page.locator('[name="assignee_id"]')
    this.titleField = page.locator('[name="title"]')
    this.statusField = page.locator('[name="status_id"]')

    this.assigneeFilter = this.page.getByLabel('Assignee')
    this.statusFilter = this.page.getByLabel('Status')
    this.labelFilter = this.page.getByLabel('Label')
  }

  get filters() {
    return {
      'Assignee': this.assigneeFilter,
      'Status': this.statusFilter,
      'Label': this.labelFilter,
    }
  }

  async checkUIElements() {
    await super.checkUIElements([
      this.assigneeSelect,
      this.titleInput,
      this.contentInput,
      this.statusSelect,
      this.labelSelect,
      this.submitButton
    ])
  }

  async successEdit(assignee, title, status, content = null, label = null) {
    await this.selectOption(this.assigneeSelect, assignee)
    await this.titleInput.fill(title)
    if (content) { await this.contentInput.fill(content)}
    await this.selectOption(this.statusSelect, status)
    await this.selectOption(this.labelSelect, label)
    await this.clickSubmitButton()
  }

  async checkEmptyFields() {
    const fields = [
      { name: 'Assignee', key: 'assigneeField' },
      { name: 'Title', key: 'titleField' },
      { name: 'Status', key: 'statusField' }
    ]
    await super.validateEmptyFields(fields)
  }

  async goToTaskEdit(title) {
    const task = this.getItem(title)
    await task.locator('a[aria-label="Edit"]').click()
  }

  async goToTaskShow(title) {
    const task = this.getItem(title)
    await task.locator('a[aria-label="Show"]').click()
  }

  getColumnByStatus(status) {
    return this.page.locator('div').filter({ has: this.page.locator(`h6:has-text("${status}")`) }).last()
  }

  async checkTask(title, status, content = null) {
    await super.checkItem(title, content)
    const task = this.getItem(title)
    const column = this.page.locator('div').filter({ has: this.page.locator(`h6:has-text("${status}")`) }).last()
    await expect(column.locator(task)).toBeVisible()
  }

  async dragTaskToStatus(title, status) {
    const task =  this.getItem(title)
    const targetColumn = this.page.locator('div').filter({ has: this.page.locator(`h6:has-text("${status}")`) }).last()
    const taskBox = await task.boundingBox()
    const columnBox = await targetColumn.boundingBox()
    if (!taskBox || !columnBox) {
      throw new Error(`Не удалось найти координаты для задачи "${title}" или колонки "${status}"`)
    }

    await this.page.mouse.move(taskBox.x + taskBox.width / 2, taskBox.y + taskBox.height / 2)
    await this.page.mouse.down()
    await this.page.mouse.move(
      columnBox.x + columnBox.width / 2, 
      columnBox.y + columnBox.height / 2, 
      { steps: 10 }
    )
    await this.page.mouse.up()
    await this.page.waitForLoadState('networkidle')
  }
}
