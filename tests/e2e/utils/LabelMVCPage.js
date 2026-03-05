import { expect } from '@playwright/test'

export default class LabelMVCPage {
  /**
   * @param {Page} page
   */
  constructor(page) {
    this.page = page
    this.nameInput = page.getByLabel('Name')
    this.submitButton = page.getByRole('button', { name: 'Save' })
    this.deleteButton = page.getByRole('button', { name: 'Delete' })
    this.alert = page.getByText('The form is not valid. Please check for errors')
    this.createPopup = page.getByText('Element created')
  }

  async gotoCreate() {
    await this.page.goto('/#/labels/create')
  }
  
  async checkUIElements() {
    const elements = [
      this.nameInput,
      this.submitButton
    ]

    for (const element of elements) {
      await expect(element).toBeVisible()
    }
  }

  async fillName(name) {
    await this.nameInput.fill(name)
  }
  
 async clickSubmitButton() {
    await this.submitButton.click()
  }

  async successEdit(name) {
    await this.fillName(name)
    await this.clickSubmitButton()
  }

  async successCreate(name) {
    await this.gotoCreate()
    await this.successEdit(name)
  }

  async checkFieldError(input, errorMessage) {
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    const helperTextId = await input.getAttribute('aria-describedby')
    const errorElement = this.page.locator(`[id="${helperTextId}"]`)
    await expect(errorElement).toBeVisible()
    await expect(errorElement).toHaveText(errorMessage)
  }
  
  async checkEmptyFields() {
    const errorMessage = 'Required'
    await this.nameInput.fill('text')
    await this.nameInput.fill('')
    await this.clickSubmitButton()
    await this.checkFieldError(this.nameInput, errorMessage)
    await expect(this.alert).toBeVisible()
  }
}
