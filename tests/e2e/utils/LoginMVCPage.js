import { expect } from '@playwright/test'

export default class LoginMVCPage {
  /**
   * @param {Page} page
   */
  constructor(page) {
    this.page = page
    this.usernameInput = page.getByLabel('Username')
    this.passwordInput = page.getByLabel('Password')
    this.signInButton = page.getByRole('button', { name: 'Sign in' })
    this.alert = page.getByText('The form is not valid. Please check for errors')
  }

  async goto() {
    await this.page.goto('/#/login')
  }

  async checkUIElements() {
    const elements = [
      this.usernameInput,
      this.passwordInput,
      this.signInButton
    ]

    for (const element of elements) {
      await expect(element).toBeVisible()
  }
}

  async fillUsername(username) {
    await this.usernameInput.fill(username)
  }

  async fillPassword(password) {
    await this.passwordInput.fill(password)
  }

 async clickSignInButton() {
    await this.signInButton.click()
  }

  async successAuth(username, password) {
    await this.fillUsername(username)
    await this.fillPassword(password)
    await this.clickSignInButton()
  }

  async checkFieldError(input, errorMessage) {
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    const helperTextId = await input.getAttribute('aria-describedby')
    const errorElement = this.page.locator(`[id="${helperTextId}"]`)
    await expect(errorElement).toBeVisible()
    await expect(errorElement).toHaveText(errorMessage)
  }
}
