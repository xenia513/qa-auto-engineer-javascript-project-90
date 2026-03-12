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

  get fields() { 
    return [
      { locator: this.nameInput, required: true },
      { locator: this.slugInput, required: true },
      { locator: this.submitButton }
    ]
  }

  async successEdit(name, slug) {
    await this.nameInput.fill(name)
    await this.slugInput.fill(slug)
    await super.clickSubmitButton()
  }
}
