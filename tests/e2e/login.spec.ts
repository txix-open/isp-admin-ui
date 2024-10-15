import { test, expect } from '@playwright/test'

import { apiPaths } from '../../src/constants/api/apiPaths'

const loginPageUrl = '/login'

const validLoginData = { email: 'test@example.com', password: 'validPassword' }
const validLoginResponse = {
  token: 'token',
  expired: 'date',
  headerName: 'header'
}

const invalidLoginData = {
  email: 'test@example.com',
  password: 'wrongPassword'
}
const invalidLoginResponse = {
  response: {
    status: 401,
    statusText: 'Unauthorized'
  }
}

test.describe('Login Page Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(loginPageUrl)
  })

  test('страница отрисовалась', async ({ page }) => {
    await expect(page.getByTestId('login-title')).toHaveText('Вход в систему')
    await expect(page.getByTestId('email-input')).toBeVisible()
    await expect(page.getByTestId('password-input')).toBeVisible()
    await expect(page.getByTestId('submit-btn')).toBeVisible()
  })

  test('ошибка валидации полей', async ({ page }) => {
    await page.getByTestId('submit-btn').click()
    const passwordFieldError = page.getByText('Поле не может быть пустым')
    await expect(passwordFieldError).toHaveCount(2)
  })

  test('Валидные данные', async ({ page }) => {
    await page.route(`**${apiPaths.login}`, (route) => {
      const request = route.request()
      const postData = request.postData()

      expect(postData).toContain(`"email":"${validLoginData.email}"`)
      expect(postData).toContain(`"password":"${validLoginData.password}"`)

      return route.fulfill({
        status: 200,
        body: JSON.stringify(validLoginResponse)
      })
    })
    await page.route(`**${apiPaths.getProfile}`, (route) => {
      return route.fulfill({
        status: 200,
        body: ''
      })
    })
    await page.route(`**${apiPaths.getUI}`, (route) => {
      return route.fulfill({
        status: 200,
        body: ''
      })
    })
    await page.route(`**${apiPaths.getModules}`, (route) => {
      return route.fulfill({
        status: 200,
        body: '[]'
      })
    })

    await page.getByTestId('email-input').fill(validLoginData.email)
    await page.getByTestId('password-input').fill(validLoginData.password)

    await page.getByTestId('submit-btn').click()
  })

  test('Неверный логин или пароль', async ({ page }) => {
    await page.route(`**${apiPaths.login}`, (route) => {
      route.fulfill({
        status: 401,
        body: JSON.stringify(invalidLoginResponse)
      })
    })

    await page.getByTestId('email-input').fill(invalidLoginData.email)
    await page.getByTestId('password-input').fill(invalidLoginData.password)

    await page.getByTestId('submit-btn').click()

    const passwordFieldError = page.getByText('Неверный логин или пароль')
    await expect(passwordFieldError).toBeVisible()
  })
  test('Внутренняя ошибка', async ({ page }) => {
    await page.route(`**${apiPaths.login}`, (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify(invalidLoginResponse)
      })
    })

    await page.getByTestId('email-input').fill(invalidLoginData.email)
    await page.getByTestId('password-input').fill(invalidLoginData.password)

    await page.getByTestId('submit-btn').click()

    const textError = page.getByText('Внутренняя ошибка сервиса')
    await expect(textError).toBeVisible()
  })
})
