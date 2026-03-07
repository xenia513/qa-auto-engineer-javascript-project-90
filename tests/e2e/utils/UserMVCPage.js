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
  
  async checkUIElements() {
    await super.checkUIElements([
      this.emailInput,
      this.firstNameInput,
      this.lastNameInput,
      this.submitButton
    ])
  }

  async successEdit(email, firstname, lastname) {
    await this.emailInput.fill(email)
    await this.firstNameInput.fill(firstname)
    await this.lastNameInput.fill(lastname)
    await super.clickSubmitButton()
  }

  async checkEmptyFields() {
    const fields = [
      { name: 'Email', key: 'emailInput' },
      { name: 'First Name', key: 'firstNameInput' },
      { name: 'Last Name', key: 'lastNameInput' }
    ]
    await super.validateEmptyFields(fields)
  }
}
