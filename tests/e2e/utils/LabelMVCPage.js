import BaseMVCPage from './BaseMVCPage.js'

export default class LabelMVCPage extends BaseMVCPage {
  /**
   * @param {Page} page
   */
  constructor(page) {
    super(page)
    this.url = '/#/labels'
    this.nameInput = page.getByLabel('Name')
    this.emptyText = 'No Labels yet'
  }
  
  async checkUIElements() {
    await super.checkUIElements([
      this.nameInput,
      this.submitButton
    ])
  }

  async successEdit(name) {
    await this.nameInput.fill(name)
    await this.clickSubmitButton()
  }
 
  async checkEmptyFields() {
    const fields = [
      { name: 'Name', key: 'nameInput' },
    ]
    await super.validateEmptyFields(fields)
  }
}
