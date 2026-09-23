import { expect, Locator, Page } from '@playwright/test';
import { faker } from '@faker-js/faker';

/**
 * Page Object Model base for SauceDemo.
 */
export class Login {
    readonly page: Page
    readonly usernameInput: Locator
    readonly passwordInput: Locator
    readonly loginButton: Locator

	constructor(page: Page) {
		this.page = page;
		this.usernameInput = this.page.locator('//input[@id="user-name"]')
		this.passwordInput = this.page.locator('//input[@id="password"]')
		this.loginButton = this.page.locator('//input[@id="login-button"]');
	}
    
    // Method to navigate to the SauceDemo page
	async navigate(): Promise<void> {
		await this.page.goto('https://www.saucedemo.com/')
	}

    // Method to perform login action
    async login(username: string, password: string): Promise<void> {
        await this.navigate();
        await this.usernameInput.fill(username)
        await this.passwordInput.fill(password)
        await this.loginButton.click()
    }
}
