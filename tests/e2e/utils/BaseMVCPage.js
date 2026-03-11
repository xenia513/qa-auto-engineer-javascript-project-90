import { expect } from '@playwright/test'

export default class BaseMVCPage {
  constructor(page) {
    this.page = page

    this.massDeletePopup = page.getByText('elements deleted')
    this.deletePopup = page.getByText('Element deleted')
    this.createPopup = page.getByText('Element created')
    this.updatePopup = page.getByText('Element updated')

    this.validationAlert = page.getByText('The form is not valid. Please check for errors')
    this.errorAlert = page.getByText('Element does not exist')

    this.createButton = page.getByLabel('Create')
    this.submitButton = page.locator('button[type="submit"]').filter({ hasText: /save/i })
    this.deleteButton = page.getByRole('button', { name: 'Delete' })

    this.tableBody = page.locator('tbody')
    this.tableRows = page.locator('tbody tr')

    this.paginationInfo = page.locator('.MuiTablePagination-displayedRows')
    this.pageSizeSelector = page.locator('.MuiTablePagination-select')

    this.itemLocator = 'tr'
  }

  async checkAuth(expectedUrl = `${this.url}`) {
    if (expectedUrl.includes('login') || this.page.url().includes('login')) {
      return
    }
    
    await this.page.waitForTimeout(1000)
    if (!this.page.url().includes('login')) {
      if (!this.page.url().includes(expectedUrl)) {
        await this.page.goto(expectedUrl)
      }
      return
    }
    await this.page.waitForTimeout(1000)
    if (this.page.url().includes('login')) {
      await this.page.locator('input[name="username"]').fill('username')
      await this.page.locator('input[name="password"]').fill('password')
      await Promise.all([
        this.page.waitForURL('**/#/'), 
        this.page.getByRole('button', { name: /Sign in/i }).click(),
      ])
    }
    const currentUrl = this.page.url()
    if (!currentUrl.includes(expectedUrl)) {
        await this.page.goto(expectedUrl, { waitUntil: 'networkidle' })
    }
  }

  async goto() {
    await this.page.goto(`${this.url}`)
    await this.checkAuth()
  }

  async gotoCreate() {
    const createUrl = `${this.url}/create`
    await this.page.goto(createUrl)
    await this.checkAuth(createUrl)
    }
  
  async gotoItem(id) {
    const itemUrl = `${this.url}/${id}`
    await this.page.goto(itemUrl)
    await expect(this.page).toHaveURL(new RegExp(itemUrl))
    await this.page.locator('input').first().waitFor({ state: 'visible', timeout: 10000 })
  }

  async checkUIElements(elements) {
    for (const element of elements) {
      await expect(element).toBeVisible({ timeout: 10000 })
      await expect(element).toBeVisible()
    }
  }

  async clickSubmitButton() {
    await this.submitButton.click()
  }

  async successCreate(...args) {
    await this.gotoCreate()
    await this.successEdit(...args)
    await expect(this.createPopup).toBeVisible()
    await this.goto()
  }

  async expectUpdateSuccess() {
    await expect(this.page).toHaveURL(new RegExp(this.url))
    await expect(this.updatePopup).toBeVisible()
  }

  getItem(name) {
    return this.page.locator(this.itemLocator).filter({ hasText: name })
  }

  async getId(name) {
    const item = await this.getItem(name)
    await expect(item).toBeVisible({ timeout: 10000 })
    let id = await item.getAttribute('data-rfd-draggable-id')
    if (!id) {
      const idCell = item.locator('td').nth(1)
      id = await idCell.innerText()
    }
  return id.trim()
  }

  async selectItem(name) {
    const item = this.getItem(name)
    const checkbox = item.getByRole('checkbox')
    await checkbox.click()
    await expect(checkbox).toBeChecked()
  }

  async selectAll() {
    const selectAllCheckbox = this.page.getByRole('checkbox').first()
    await selectAllCheckbox.click()
    await expect(selectAllCheckbox).toBeChecked()
    const checkboxes = this.tableRows.getByRole('checkbox')
    const count = await checkboxes.count()
    for (let i = 0; i < count; i++) {
        await expect(checkboxes.nth(i)).toBeChecked()
    }
  }

  get items() {
    return this.page.locator(this.itemLocator)
  }

  async checkItem(name, ...params) {
    const item = this.getItem(name)
    await expect(item).toBeVisible()
    for (const param of params) {
      if (param) {
        await expect(item).toContainText(param)
      }
    }
  }

  async checkFieldError(fieldLocator, errorMessage) {
    const field = fieldLocator
    .locator('input')
    .or(fieldLocator.locator('[role="combobox"]'))
    .or(fieldLocator)
    .first()
    await expect(field).toHaveAttribute('aria-invalid', 'true')
    const container = this.page.locator('.MuiFormControl-root').filter({ has: field })
    const errorElement = container.locator('.Mui-error, .MuiFormHelperText-root').filter({ hasText: errorMessage })
    await expect(errorElement).toBeVisible()
    await expect(errorElement).toHaveText(errorMessage)
  }

  async validateEmptyFields(fields) {
    for (const field of fields) {
      const fieldLocator = this[field.key].locator('input, textarea').or(this[field.key])
      await fieldLocator.fill('temp')
      await fieldLocator.fill('')
    }
    await this.clickSubmitButton()
    await expect(this.validationAlert).toBeVisible()

    for (const field of fields) {
      const fieldLocator = this[field.key]
      await this.checkFieldError(fieldLocator, 'Required')
    }
  }

  async deleteItem(name, id) {
    await this.deleteButton.click({ force: true })
    await expect(this.page).toHaveURL(this.url)
    await expect(this.deletePopup).toBeVisible()
    await expect(this.deletePopup).toBeHidden()
    const item = this.page.locator(`[data-rfd-draggable-id]`).filter({ hasText: name, exact: true })
    await expect(item).not.toBeVisible()
    await this.page.goto(`${this.url}/${id}`)
    await expect(this.errorAlert).toBeVisible()
  }

  async deleteAll() {
    await this.selectAll()
    await this.deleteButton.click()
    await expect(this.page).toHaveURL(this.url)
    await expect(this.massDeletePopup).toBeVisible()
    await expect(this.massDeletePopup).toBeHidden()
    const emptyMessage = this.page.getByText(this.emptyText)
    await expect(emptyMessage).toBeVisible()
  }

  async filterBy(filterLocator, value = 'Clear value') {
    await filterLocator.click()
    await this.page.getByRole('option', { name: value, exact: true }).click()
    await this.page.waitForLoadState('networkidle')
  }

  async selectOption(selectLocator, optionName) {
    if (!optionName) return
    await selectLocator.click()
    const listbox = this.page.getByRole('listbox')
    const isMulti = await listbox.getAttribute('aria-multiselectable')
    await this.page.getByRole('option', { name: optionName }).click()
    if (isMulti === 'true') {
      await this.page.keyboard.press('Escape')
    }
    await expect(this.page.getByRole('listbox')).not.toBeVisible()
  }

  async setPageSize(size) {
    await this.pageSizeSelector.click()
    await this.page.getByRole('option', { name: size.toString(), exact: true }).click()
    await this.page.waitForLoadState('networkidle')
  }
}
