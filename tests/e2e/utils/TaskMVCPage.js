import { expect } from '@playwright/test'

export default class TaskMVCPage {
  /**
   * @param {Page} page
   */
  constructor(page) {
    this.page = page
    this.assigneeSelect = page.getByLabel('Assignee')
    this.listbox = page.getByRole('listbox')
    this.titleInput = page.getByLabel('Title')
    this.contentInput = page.locator('textarea[name="content"]')
    this.statusSelect = page.getByLabel('Status')
    this.labelSelect = page.getByLabel('Label')
    this.submitButton = page.getByRole('button', { name: 'Save' })
    this.deleteButton = page.getByRole('button', { name: 'Delete' })
    this.alert = page.getByText('The form is not valid. Please check for errors')
    this.createPopup = page.getByText('Element created')
    this.assignee_id = page.locator('[name="assignee_id"]')
    this.title = page.locator('[name="title"]')
    this.status_id = page.locator('[name="status_id"]')
  }

  async gotoCreate() {
    await this.page.goto('/#/tasks/create')
  }

  async gotoTask(id) {
    await this.page.goto(`/#/tasks/${id}`)
  }
  
  async checkUIElements() {
    const elements = [
      this.assigneeSelect,
      this.titleInput,
      this.contentInput,
      this.statusSelect,
      this.labelSelect,
      this.submitButton
    ]

    for (const element of elements) {
      await expect(element).toBeVisible()
    }
  }

  async selectAssignee(assignee) {
    await this.assigneeSelect.click()
    const option = this.page.getByRole('option', { name: assignee })
    await option.click()
    await expect(this.listbox).not.toBeVisible()
  }

  async fillTitle(title) {
    await this.titleInput.fill(title)
  }

  async fillContent(content = null) {
    if (content) {
      await this.contentInput.fill(content)
    }
  }

  async selectStatus(status) {
    await this.statusSelect.click()
    const option = this.page.getByRole('option', { name: status })
    await option.click()
    await expect(this.listbox).not.toBeVisible()
  }

  async selectLabel(label = null) {
    if (label) {
      await this.labelSelect.click()
      const option = this.page.getByRole('option', { name: label })
      await option.click()
      await this.page.keyboard.press('Escape')
    }
  }

 async clickSubmitButton() {
    await this.submitButton.click()
  }

  async successEdit(assignee, title, status, content = null, label = null) {
    await this.selectAssignee(assignee)
    await this.fillTitle(title)
    if (content) {
      await this.fillContent(content)
    }
    await this.selectStatus(status)
    if (label) {
      await this.selectLabel(label)
    }

    await this.clickSubmitButton()
  }

  async successCreate(assignee, title, status, content = null, label = null) {
    await this.gotoCreate()
    await this.successEdit(assignee, title, status, content, label)
  }

  async checkFieldError(fieldLocator, errorMessage) {
    const field = fieldLocator
    .locator('input')
    .or(fieldLocator.locator('[role="combobox"]'))
    .or(fieldLocator)
    .first()
    await expect(field).toHaveAttribute('aria-invalid', 'true')
    const container = this.page.locator('.MuiFormControl-root').filter({ has: field })
    const errorElement = container.locator('.Mui-error, .MuiFormHelperText-root').filter({ hasText: errorMessage })
    await expect(errorElement).toBeVisible()
    await expect(errorElement).toHaveText(errorMessage)
  }
  
  async checkEmptyFields() {
    const fields = [
      { name: 'Assignee', key: 'assignee_id' },
      { name: 'Title', key: 'title' },
      { name: 'Status', key: 'status_id' }
    ]
    const errorMessage = 'Required'
    await this.clickSubmitButton()
    await expect(this.alert).toBeVisible()

    for (const field of fields) {
      const fieldLocator = this[field.key]
      await this.checkFieldError(fieldLocator, errorMessage)
    }
  }
}
