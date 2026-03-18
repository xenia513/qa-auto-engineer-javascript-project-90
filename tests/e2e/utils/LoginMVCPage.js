import BaseMVCPage from './BaseMVCPage.js'

export default class LoginMVCPage extends BaseMVCPage {
  /**
   * @param {Page} page
   */
  constructor(page) {
    super(page)
    this.url = '/#/login'
    this.usernameInput = page.getByLabel('Username')
    this.passwordInput = page.getByLabel('Password')
    this.submitButton = page.getByRole('button', { name: 'Sign in' })
  }

  get fields() { 
    return [
      { locator: this.usernameInput, required: true },
      { locator: this.passwordInput, required: true },
      { locator: this.submitButton }
    ]
  }

  get submitDisabled() {
    return false
}

  async successAuth(username, password) {
    await this.usernameInput.fill(username)
    await this.passwordInput.fill(password)
    await this.clickSubmitButton()
  }
}
