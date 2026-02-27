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
    await this.page.goto('http://localhost:5173/#/login')
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

  async successAuth() {
    await this.fillUsername('username')
    await this.fillPassword('password')
    await this.clickSignInButton()
  }
}
