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
    this.undoButton = page.locator('.MuiSnackbarContent-action').getByRole('button')

    this.tableBody = page.locator('tbody')
    this.tableRows = page.locator('tbody tr')

    this.paginationInfo = page.locator('.MuiTablePagination-displayedRows')
    this.pageSizeSelector = page.locator('.MuiTablePagination-select')
    this.nextPageButton = page.getByRole('button', { name: /Go to next page/i })
    this.prevPageButton = page.getByRole('button', { name: /Go to previous page/i })

    this.itemLocator = 'tr'
  }

  get filters() {
    return {}
  }

  async goto() {
    await this.page.goto(`${this.url}`)
    await expect(this.page).toHaveURL(`${this.url}`)
  }

  async gotoCreate() {
    const createUrl = `${this.url}/create`
    await this.page.goto(createUrl)
    await expect(this.page).toHaveURL(createUrl)
    }
  
  async gotoItem(id) {
    const itemUrl = `${this.url}/${id}`
    await this.page.goto(itemUrl)
    await expect(this.page).toHaveURL(new RegExp(itemUrl))
    await this.page.locator('input').first().waitFor({ state: 'visible', timeout: 10000 })
  }

  async checkUIElements(fields = this.fields) {
    if (!this.page.url().includes('login')) {
      await expect(this.submitButton).toBeDisabled()
    }

    for (const field of fields) {
      const locator = field.locator || field
      const isRequired = field.required || false
      await expect(locator).toBeVisible({ timeout: 10000 })

      if (!this.page.url().includes('create') && !this.page.url().includes('login')) {
        const tagName = await locator.evaluate(el => el.tagName.toLowerCase())
        const role = await locator.getAttribute('role')
        const isInput = ['input', 'select', 'textarea'].includes(tagName) || role === 'combobox'
        
        if (isInput && isRequired) {
          const value = await locator.inputValue().catch(() => locator.innerText())
          expect(value).not.toBe('')
        }
      }
    }
  }

  async clickSubmitButton() {
    await this.submitButton.click()
  }

  async successCreate(name, ...args) {
    await this.gotoCreate()
    await this.successEdit(name, ...args)
    await expect(this.createPopup).toBeVisible()
    await expect(this.page.locator('h6#react-admin-title')).toContainText(name)
    await this.goto()
  }

  async expectUpdateSuccess() {
    await expect(this.page).toHaveURL(new RegExp(this.url))
    await expect(this.updatePopup).toBeVisible()
  }

  getItem(name) {
    return this.page.locator(this.itemLocator).filter({ hasText: name, exact: true })
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
    const allChecked = await checkboxes.evaluateAll(list => list.every(cb => cb.checked))
    expect(allChecked).toBe(true)
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
    const container = this.page.locator('.MuiFormControl-root').filter({ has: fieldLocator }).first()
    const errorElement = container.locator('.Mui-error, .MuiFormHelperText-root').filter({ hasText: errorMessage })
    await expect(errorElement).toBeVisible()
    await expect(errorElement).toHaveText(errorMessage)
  }

  async checkEmptyFields(fields = this.fields) {
    const urlBefore = this.page.url()
    const requiredFields = fields.filter(field => field.required)
    for (const field of requiredFields) {
      const fieldLocator = field.locator
      const tagName = await fieldLocator.evaluate(el => el.tagName.toLowerCase())
      const isEditable = ['input', 'textarea'].includes(tagName) || await fieldLocator.getAttribute('contenteditable') === 'true'

      if (isEditable) {
        await fieldLocator.fill('temp')
        await fieldLocator.fill('')
      } else {
        await fieldLocator.click()
        await this.page.keyboard.press('Escape')
      }
    }
    await this.clickSubmitButton()
    await expect(this.page).toHaveURL(urlBefore)
    await expect(this.validationAlert).toBeVisible()
    await expect(this.submitButton).toBeEnabled()

    for (const field of requiredFields) {
      await this.checkFieldError(field.locator, 'Required')
    }
  }

  async deleteItem(name, id) {
    await this.deleteButton.click({ force: true })
    await expect(this.page).toHaveURL(this.url)
    await expect(this.deletePopup).toBeVisible()
    await expect(this.deletePopup).toBeHidden()
    const item = this.page.locator(`[data-rfd-draggable-id]`).filter({ hasText: name, exact: true })
    await expect(item).toHaveCount(0)
    await this.page.goto(`${this.url}/${id}`)
    await expect(this.errorAlert).toBeVisible()
  }

  async deleteAll() {
    const { total } = await this.getPaginationData()
    if (total > 0) {
      while (await this.items.count() > 0) {
        await this.selectAll()
        await this.deleteButton.click()
        await expect(this.page).toHaveURL(new RegExp(`${this.url}`))
        await expect(this.massDeletePopup).toBeVisible()
        await expect(this.massDeletePopup).toBeHidden()
        await this.page.waitForLoadState('networkidle')
      }
    }
    await expect(this.items).toHaveCount(0)
    const emptyMessage = this.page.getByText(this.emptyText)
    await expect(emptyMessage).toBeVisible()
    await expect(this.createButton).toBeVisible()
  }

  async applyFilter(type, value = 'Clear value') {
    const filterLocator = this.filters[type]
    await filterLocator.click()
    await this.page.getByRole('option', { name: value, exact: true }).click()
    await this.page.waitForLoadState('networkidle')
  }

  async checkFilteredItems(appliedFilter) {
    const items = this.items
    const count = await items.count()

    for (let i = 0; i < count; i++) {
      const id = await items.nth(i).getAttribute('data-rfd-draggable-id')
      await this.gotoItem(id)
      await expect(this.page.locator('body')).toContainText(appliedFilter)
      await this.goto()
      await this.page.waitForLoadState('networkidle')
    }
  }

  async resetAllFilters() {
    for (const type of Object.keys(this.filters)) {
      await this.applyFilter(type)
    }
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

  async getPaginationData() {
    const text = await this.paginationInfo.textContent()
    const numbers = text.match(/\d+/g).map(Number)
    return {
      start: numbers[0],
      end: numbers[1],
      total: numbers[2]
  }
  }

  async goToNextPage() {
    await this.nextPageButton.click()
    await this.page.waitForLoadState('networkidle')
  }

  async goToPrevPage() {
    await this.prevPageButton.click()
    await this.page.waitForLoadState('networkidle')
  }

  async getPageSizes() {
    await this.pageSizeSelector.click()
    const options = this.page.getByRole('option')
    const texts = await options.allInnerTexts()
    const sizes = texts.map(t => Number.parseInt(t, 10))
    await this.page.keyboard.press('Escape')
    return sizes
  }

  async setPageSize(size) {
    await this.pageSizeSelector.click()
    await this.page.getByRole('option', { name: size.toString(), exact: true }).click()
    await this.page.waitForLoadState('networkidle')
  }

  async checkPagination() {
    const sizes = await this.getPageSizes()

    for (const size of sizes) {
      await this.setPageSize(size)
      const temp = await this.getPaginationData()
      const firstPageEnd = Math.min(size, temp.total)
      await expect(this.paginationInfo).toContainText(`1-${firstPageEnd} of ${temp.total}`)
      const pageInfo = await this.getPaginationData()
      await expect(this.tableRows).toHaveCount(firstPageEnd)
      expect(pageInfo.start).toBe(1)
      expect(pageInfo.end).toBe(firstPageEnd)

      if (pageInfo.total > size) {
        const firstRowItem = await this.tableRows.first().locator('td').nth(1).innerText()
        await expect(this.prevPageButton).toBeDisabled()
        await this.goToNextPage()

        const secondPageStart = size + 1
        const secondPageEnd = Math.min(size * 2, pageInfo.total)

        await expect(this.paginationInfo).toHaveText(`${secondPageStart}-${secondPageEnd} of ${pageInfo.total}`)
        await expect(this.tableRows).toHaveCount(secondPageEnd - size)

        const secondRowItem = await this.tableRows.first().innerText()
        expect(secondRowItem).not.toEqual(firstRowItem)

        if (secondPageEnd == pageInfo.total) {
          await expect(this.nextPageButton).toBeDisabled()
        }
        await this.goToPrevPage()

        await expect(this.tableRows.first().locator('td').nth(1)).toContainText(firstRowItem)
      } else {
        await expect(this.nextPageButton).not.toBeVisible()
      }
    }
  }
}
