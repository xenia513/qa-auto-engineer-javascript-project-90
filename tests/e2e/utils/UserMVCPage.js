import { expect } from '@playwright/test'
import BaseMVCPage from './BaseMVCPage.js'

export default class UserMVCPage extends BaseMVCPage {
  /**
   * @param {Page} page
   */
  constructor(page) {
    super(page)
    this.url = '/#/users'
    this.emailInput = page.getByLabel('Email')
    this.firstNameInput = page.getByLabel('First name')
    this.lastNameInput = page.getByLabel('Last name')
    this.emptyText = 'No Users yet'
  }
  
  get fields() { 
    return [
      { locator: this.emailInput, required: true },
      { locator: this.firstNameInput, required: true },
      { locator: this.lastNameInput, required: true },
      { locator: this.submitButton }
    ]
  }

  async successEdit(email, firstname, lastname) {
    await this.emailInput.fill(email)
    await this.firstNameInput.fill(firstname)
    await this.lastNameInput.fill(lastname)
    await super.clickSubmitButton()
  }

  async checkInvalidEmail() {
    const invalidEmails = [
      'plainaddress',
      '#@%^%#$@#$@#.com',
      '@example.com',
      'Joe Smith <email@example.com>',
      'email.example.com',
      'email@example@example.com',
      'email@example.com (Joe Smith)',
      'email@example',
      //'.email@example.com',
      //'email.@example.com',
      //'email..email@example.com',
      //'емейл@example.com',
      //'email@-example.com',
      //'email@111.222.333.44444',
    ]

    const errorMessage = 'Incorrect email format'

    for (const email of invalidEmails) {
      await this.emailInput.fill(email)
      await this.clickSubmitButton()
      await super.checkFieldError(this.emailInput, errorMessage)
      await expect(this.validationAlert).toBeVisible()
    }
  }
}
