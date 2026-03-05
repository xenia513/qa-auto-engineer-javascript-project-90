import { test as base } from '@playwright/test'
import { faker } from '@faker-js/faker'
import LoginMVCPage from './LoginMVCPage.js'
import UserMVCPage from './UserMVCPage.js'
import UsersMVCPage from '../utils/UsersMVCPage.js'
import StatusMVCPage from '../utils/StatusMVCPage.js'
import StatusesMVCPage from '../utils/StatusesMVCPage.js'
import LabelMVCPage from '../utils/LabelMVCPage.js'
import LabelsMVCPage from '../utils/LabelsMVCPage.js'
import TaskMVCPage from './TaskMVCPage.js'
import TasksMVCPage from './TasksMVCPage.js'


export const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginMVCPage(page))
  },

  loggedPage: async ({ loginPage, page }, use) => {
    await loginPage.goto()
    await loginPage.successAuth('username', 'password')
    await use(page)
  },

  userPage: async ({ loggedPage }, use) => {
    await use(new UserMVCPage(loggedPage))
  },

  usersPage: async ({ loggedPage }, use) => {
    await use(new UsersMVCPage(loggedPage))
  },

  statusPage: async ({ loggedPage }, use) => {
    await use(new StatusMVCPage(loggedPage))
  },

  statusesPage: async ({ loggedPage }, use) => {
    await use(new StatusesMVCPage(loggedPage))
  },

  labelPage: async ({ loggedPage }, use) => {
    await use(new LabelMVCPage(loggedPage))
  },

  labelsPage: async ({ loggedPage }, use) => {
    await use(new LabelsMVCPage(loggedPage))
  },

  taskPage: async ({ loggedPage }, use) => {
    await use(new TaskMVCPage(loggedPage))
  },

  tasksPage: async ({ loggedPage }, use) => {
    await use(new TasksMVCPage(loggedPage))
  },

  testData: async ({ userPage, labelPage, statusPage }, use) => {
    const data = {
      email: faker.internet.email(),
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      label: faker.color.human(),
      status: faker.book.title(),
      slug: faker.book.author()
    }
    
    await userPage.successCreate(data.email, data.firstname, data.lastname)
    await labelPage.successCreate(data.label)
    await statusPage.successCreate(data.status, data.slug)
    
    await use(data)
  }
})

export { expect } from '@playwright/test'