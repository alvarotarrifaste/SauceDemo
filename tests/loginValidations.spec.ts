import { test, expect } from '@playwright/test'
import { Login } from '../pageObject/Login'


test('Login with valid user', async ({ page }) => {
  const login = new Login(page)
  await login.login('standard_user', 'secret_sauce')

  await expect(page.locator('//*[@id="header_container"]/div[1]/div[2]/div')).toContainText('Swag Labs')
})

test('Login with blocked user', async ({ page }) => {
  const login = new Login(page)
  await login.login('locked_out_user', 'secret_sauce')

  await expect(page.locator('//div[@class="error-message-container error"]')).toContainText('Epic sadface: Sorry, this user has been locked out.')
})

test('Login with wrong user/password', async ({ page }) => {
  const login = new Login(page)
  await login.login('wrong_user', 'wrong_password')

  await expect(page.locator('//div[@class="error-message-container error"]')).toContainText('Epic sadface: Username and password do not match any user in this service')
})

/* 
Users:
standard_user
locked_out_user
error_user // To perform shopping cart actions

Password for all users:
secret_sauce
*/