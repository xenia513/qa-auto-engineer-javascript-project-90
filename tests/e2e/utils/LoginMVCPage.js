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

  async checkUIElements() {
    await super.checkUIElements([
      this.usernameInput,
      this.passwordInput,
      this.submitButton
    ])
  }

  async successAuth(username, password) {
    await this.usernameInput.fill(username)
    await this.passwordInput.fill(password)
    await this.clickSubmitButton()
  }

  async checkEmptyFields() {
    const fields = [
      { name: 'Username', key: 'usernameInput' },
      { name: 'Password', key: 'passwordInput' }
    ]
    await super.validateEmptyFields(fields)
  }
}
