import BaseMVCPage from './BaseMVCPage.js'

export default class StatusMVCPage extends BaseMVCPage {
  /**
   * @param {Page} page
   */
  constructor(page) {
    super(page)
    this.url = '/#/task_statuses'
    this.nameInput = page.getByLabel('Name')
    this.slugInput = page.getByLabel('Slug')
    this.emptyText = 'No Task statuses yet'
  }

  async checkUIElements() {
    await super.checkUIElements([
      this.nameInput,
      this.slugInput,
      this.submitButton
    ])
  }

  async successEdit(name, slug) {
    await this.nameInput.fill(name)
    await this.slugInput.fill(slug)
    await super.clickSubmitButton()
  }
  
  async checkEmptyFields() {
    const fields = [
      { name: 'Name', key: 'nameInput' },
      { name: 'Slug', key: 'slugInput' }
    ]
    await super.validateEmptyFields(fields)
  }
}
