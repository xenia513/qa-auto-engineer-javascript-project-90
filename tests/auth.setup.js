import { test as setup, expect } from '@playwright/test'
import path from 'node:path'
import fs from 'node:fs'

const authFile = path.join(process.cwd(), 'playwright/.auth/user.json')

/**setup('authenticate', async ({ page }) => {
  await page.goto('http://localhost:5173/#/login', { waitUntil: 'networkidle' })

  await page.getByLabel('Username').fill('username')
  await page.getByLabel('Password').fill('password')
  
  await page.getByRole('button', { name: /Sign in/i }).click()
  await page.waitForTimeout(2000)

  await expect(page).toHaveURL('http://localhost:5173/#/', { timeout: 15000 })

  await page.context().storageState({ path: authFile })
})**/

setup('authenticate', async ({ page }) => {
  console.log('--- START AUTH SETUP ---')
  
  // 1. Проверяем доступность сервера
  try {
    await page.goto('http://localhost:5173/#/login', { timeout: 30000 })
    console.log('URL loaded successfully');
  } catch (e) {
    console.error('FAILED to load URL. Is the server running?')
    throw e;
  }
 // 2. Вводим данные (убедись, что они ВЕРНЫЕ!)
  await page.getByLabel('Username').fill('admin@email.com')
  await page.getByLabel('Password').fill('admin')
  console.log('Credentials filled')

  await page.getByRole('button', { name: /Sign in/i }).click()
  console.log('Sign in button clicked')

  // 3. Ждем перехода (увеличили таймаут для CI)
  await expect(page).toHaveURL('http://localhost:5173/#/', { timeout: 20000 })
  console.log('Logged in successfully, Dashboard visible')

  // 4. ГАРАНТИРУЕМ создание папки (на Гитхабе это критично!)
  const authDir = path.dirname(authFile)
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true })
    console.log('Created directory:', authDir)
  }

  // 5. Сохраняем состояние
  await page.context().storageState({ path: authFile })
  console.log('Storage state saved to:', authFile)
  
  // Проверяем, что файл реально создался
  if (fs.existsSync(authFile)) {
    console.log('FILE CHECK: SUCCESS! size:', fs.statSync(authFile).size)
  } else {
    console.error('FILE CHECK: FAILED! File not found after save')
  }
})
