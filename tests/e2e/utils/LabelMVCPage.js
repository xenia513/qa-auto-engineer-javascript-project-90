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
  
  get fields() { 
    return [
      { locator: this.nameInput, required: true },
      { locator: this.submitButton }
    ]
  }

  async successEdit(name) {
    await this.nameInput.fill(name)
    await this.clickSubmitButton()
  }
}
