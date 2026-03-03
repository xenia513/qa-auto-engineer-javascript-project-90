import { expect } from '@playwright/test'

export default class StatusMVCPage {
  /**
   * @param {Page} page
   */
  constructor(page) {
    this.page = page
    this.nameInput = page.getByLabel('Name')
    this.slugInput = page.getByLabel('Slug')
    this.submitButton = page.getByRole('button', { name: 'Save' })
    this.deleteButton = page.getByRole('button', { name: 'Delete' })
    this.alert = page.getByText('The form is not valid. Please check for errors')
    this.createPopup = page.getByText('Element created')
  }

  async gotoCreate() {
    await this.page.goto('/#/task_statuses/create')
  }

  async gotoStatus(id) {
    await this.page.goto(`/#/task_statuses/${id}`)
  }
  
  async checkUIElements() {
    const elements = [
      this.nameInput,
      this.slugInput,
      this.submitButton
    ]

    for (const element of elements) {
      await expect(element).toBeVisible()
    }
  }

  async fillName(name) {
    await this.nameInput.fill(name)
  }

  async fillSlug(slug) {
    await this.slugInput.fill(slug)
  }
  
 async clickSubmitButton() {
    await this.submitButton.click()
  }

  async successEdit(name, slug) {
    await this.fillName(name)
    await this.fillSlug(slug)
    await this.clickSubmitButton()
  }

  async successCreate(name, slug) {
    await this.gotoCreate()
    await this.successEdit(name, slug)
  }

  async checkFieldError(input, errorMessage) {
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    const helperTextId = await input.getAttribute('aria-describedby')
    const errorElement = this.page.locator(`[id="${helperTextId}"]`)
    await expect(errorElement).toBeVisible()
    await expect(errorElement).toHaveText(errorMessage)
  }
  
  async checkEmptyFields() {
    const fields = [
      { name: 'Name', key: 'nameInput' },
      { name: 'Slug', key: 'slugInput' }
    ]

    for (const field of fields) {
      const errorMessage = 'Required'
      const inputLocator = this[field.key]
      await inputLocator.fill('text')
      await inputLocator.fill('')
      await this.clickSubmitButton()
      await this.checkFieldError(inputLocator, errorMessage)
      await expect(this.alert).toBeVisible()
    }
  }
}
