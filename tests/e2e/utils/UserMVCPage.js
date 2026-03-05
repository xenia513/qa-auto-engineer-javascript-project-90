import { expect } from '@playwright/test'

export default class UserMVCPage {
  /**
   * @param {Page} page
   */
  constructor(page) {
    this.page = page
    this.emailInput = page.getByLabel('Email')
    this.firstNameInput = page.getByLabel('First name')
    this.lastNameInput = page.getByLabel('Last name')
    this.submitButton = page.getByRole('button', { name: 'Save' })
    this.deleteButton = page.getByRole('button', { name: 'Delete' })
    this.alert = page.getByText('The form is not valid. Please check for errors')
    this.createPopup = page.getByText('Element created')
  }

  async gotoCreate() {
    await this.page.goto('/#/users/create')
  }
  
  async checkUIElements() {
    const elements = [
      this.emailInput,
      this.firstNameInput,
      this.lastNameInput,
      this.submitButton
    ]

    for (const element of elements) {
      await expect(element).toBeVisible()
    }
  }

  async fillEmail(email) {
    await this.emailInput.fill(email)
  }

  async fillFirstName(firstName) {
    await this.firstNameInput.fill(firstName)
  }

  async fillLastName(lastName) {
    await this.lastNameInput.fill(lastName)
  }
  
 async clickSubmitButton() {
    await this.submitButton.click()
  }

  async successEdit(email, firstname, lastname) {
    await this.fillEmail(email)
    await this.fillFirstName(firstname)
    await this.fillLastName(lastname)
    await this.clickSubmitButton()
  }

  async successCreate(email, firstname, lastname) {
    await this.gotoCreate()
    await this.successEdit(email, firstname, lastname)
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
      { name: 'Email', key: 'emailInput' },
      { name: 'First Name', key: 'firstNameInput' },
      { name: 'Last Name', key: 'lastNameInput' }
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
