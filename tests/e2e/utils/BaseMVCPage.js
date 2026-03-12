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
    this.nextPageButton = page.getByRole('button', { name: /Go to next page/i })
    this.prevPageButton = page.getByRole('button', { name: /Go to previous page/i })

    this.itemLocator = 'tr'
  }

  get filters() {
    return {}
  }

  async goto() {
    await this.page.goto(`${this.url}`)

  }

  async gotoCreate() {
    const createUrl = `${this.url}/create`
    await this.page.goto(createUrl)
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
      if (!this.page.url().includes('login')) {
        await expect(this.submitButton).toBeDisabled()
      }
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
    const urlBefore = this.page.url()
    for (const field of fields) {
      const fieldLocator = this[field.key].locator('input, textarea').or(this[field.key])
      await fieldLocator.fill('temp')
      await fieldLocator.fill('')
    }
    await this.clickSubmitButton()
    await expect(this.page).toHaveURL(urlBefore)
    await expect(this.validationAlert).toBeVisible()
    await expect(this.submitButton).toBeEnabled()

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
    await expect(item).toHaveCount(0)
    await this.page.goto(`${this.url}/${id}`)
    await expect(this.errorAlert).toBeVisible()
  }

  async deleteAll() {
    await this.selectAll()
    await this.deleteButton.click()
    await expect(this.page).toHaveURL(new RegExp(`${this.url}`))
    await expect(this.massDeletePopup).toBeVisible()
    await expect(this.massDeletePopup).toBeHidden()
    await expect(this.items).toHaveCount(0)
    const emptyMessage = this.page.getByText(this.emptyText)
    await expect(emptyMessage).toBeVisible()
  }

  async applyFilter(type, value = 'Clear value') {
    const filterLocator = this.filters[type]
    await filterLocator.click()
    await this.page.getByRole('option', { name: value, exact: true }).click()
    await this.page.waitForLoadState('networkidle')
  }

  async verifyFilteredItems(appliedFilter) {
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
      const { start, end, total } = await this.getPaginationData()
      const firstPageEnd = Math.min(size, total)

      await expect(this.paginationInfo).toContainText(`1-${firstPageEnd} of ${total}`)
      await expect(this.tableRows).toHaveCount(firstPageEnd)
      expect(start).toBe(1)
      expect(end).toBe(firstPageEnd)

      if (total > size) {
        const firstRowItem = await this.tableRows.first().locator('td').nth(1).innerText()
        await expect(this.prevPageButton).toBeDisabled()
        await this.goToNextPage()

        const secondPageStart = size + 1
        const secondPageEnd = Math.min(size * 2, total)

        await expect(this.paginationInfo).toHaveText(`${secondPageStart}-${secondPageEnd} of ${total}`)
        await expect(this.tableRows).toHaveCount(secondPageEnd - size)

        const secondRowItem = await this.tableRows.first().innerText()
        expect(secondRowItem).not.toEqual(firstRowItem)

        if (secondPageEnd == total) {
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
