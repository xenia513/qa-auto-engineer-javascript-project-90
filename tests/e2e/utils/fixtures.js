import { test as base, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'
import LoginMVCPage from './LoginMVCPage.js'
import UserMVCPage from './UserMVCPage.js'
import StatusMVCPage from './StatusMVCPage.js'
import LabelMVCPage from './LabelMVCPage.js'
import TaskMVCPage from './TaskMVCPage.js'

export const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginMVCPage(page))
  },

  loggedPage: async ({ page }, use) => {
    await page.goto('/#/login')
    await page.getByLabel('Username').fill('username')
    await page.getByLabel('Password').fill('password')
    await page.getByRole('button', { name: /Sign in/i }).click()
    await expect(page.getByLabel('Profile')).toBeVisible({ timeout: 15000 })
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

  userTestData: async ({}, use) => {
    await use({
      email: faker.internet.email(),
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName()
    })
  },

  testUser: async ({ userPage, userTestData }, use) => {
    await userPage.successCreate(userTestData.email, userTestData.firstname, userTestData.lastname)
    await use(userTestData)
},

  labelTestData: async ({}, use) => {
    await use({
      label: faker.color.human()
    })
  },

  testLabel: async ({ labelPage, labelTestData }, use) => {
    await labelPage.successCreate(labelTestData.label)
    await use(labelTestData)
},

  statusTestData: async ({}, use) => {
    await use({
      status: faker.book.title(),
      slug: faker.lorem.slug()
    })
  },

  testStatus: async ({ statusPage, statusTestData }, use) => {
    await statusPage.successCreate(statusTestData.status, statusTestData.slug)
    await use(statusTestData)
  },

  taskTestData: async ({}, use) => {
    await use({
      title: faker.book.title(),
      content: faker.book.author()
    })
  },

  testTask: async ({ taskPage, taskTestData, testUser, testStatus, testLabel }, use) => {
    await taskPage.successCreate(taskTestData.title, testUser.email, testStatus.status, taskTestData.content, testLabel.label)
    await use(taskTestData)
  },
})

export { expect } from '@playwright/test'
