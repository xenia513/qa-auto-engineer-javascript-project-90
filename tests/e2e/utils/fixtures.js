import { test as base } from '@playwright/test'
import { faker } from '@faker-js/faker'
import LoginMVCPage from './LoginMVCPage.js'
import UserMVCPage from './UserMVCPage.js'
import StatusMVCPage from '../utils/StatusMVCPage.js'
import LabelMVCPage from '../utils/LabelMVCPage.js'
import TaskMVCPage from './TaskMVCPage.js'

export const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginMVCPage(page))
  },

  loggedPage: async ({ page }, use) => {
    await page.goto('/')
    if (page.url().includes('login')) {
      await page.locator('input[name="username"]').fill('username')
      await page.locator('input[name="password"]').fill('password')
      await page.getByRole('button', { name: /Sign in/i }).click()

      await page.waitForURL('**/#/')
    }
    await use(page)
  },

  userPage: async ({ loggedPage }, use) => {
    await use(new UserMVCPage(loggedPage))
  },

  statusPage: async ({ loggedPage }, use) => {
    await use(new StatusMVCPage(loggedPage))
  },

  labelPage: async ({ loggedPage }, use) => {
    await use(new LabelMVCPage(loggedPage))
  },

  taskPage: async ({ loggedPage }, use) => {
    await use(new TaskMVCPage(loggedPage))
  },

  testData: async ({ userPage, labelPage, statusPage, taskPage }, use) => {
    const data = {
      email: faker.internet.email(),
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      label: faker.color.human(),
      status: faker.book.title(),
      slug: faker.lorem.slug(),
      title: faker.book.title(),
      content: faker.book.author()
    }

    await userPage.successCreate(data.email, data.firstname, data.lastname)

    await labelPage.successCreate(data.label)

    await statusPage.successCreate(data.status, data.slug)

    await taskPage.successCreate(data.email, data.title, data.status, data.content, data.label)
    
    await use(data)
  }
})

export { expect } from '@playwright/test'
