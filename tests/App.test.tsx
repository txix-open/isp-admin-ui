import { render, screen, fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'

import LoginPage from '../src/pages/LoginPage'

const renderLoginPage = () =>
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  )

describe('LoginPage', () => {
  it('Проверка инпутов', async () => {
    renderLoginPage()

    const emailInput = screen.getByPlaceholderText('Логин') as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText(
      'Пароль'
    ) as HTMLInputElement
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
    })
    expect(emailInput.value).toBe('test@example.com')
    expect(passwordInput.value).toBe('password123')
  })
  it('Пустые значения', async () => {
    renderLoginPage()

    const emailInput = screen.getByPlaceholderText('Логин') as HTMLInputElement

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: '1' } })
      fireEvent.change(emailInput, { target: { value: '' } })
    })

    const invalidMessage = screen.getByText('Поле не может быть пустым')

    expect(invalidMessage).toBeInTheDocument()
  })
  it('Внутренняя ошибка', async () => {
    renderLoginPage()

    const emailInput = screen.getByPlaceholderText('Логин') as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText(
      'Пароль'
    ) as HTMLInputElement
    const submitButton = screen.getByRole('button', { name: /войти/i })

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'pass' } })
    })

    await act(async () => {
      fireEvent.click(submitButton)
    })
    await vi.waitFor(() => {
      const invalidMessage = screen.getByText('Внутренняя ошибка сервиса')
      expect(invalidMessage).toBeInTheDocument()
    })
  })
})
