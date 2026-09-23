import { expect, Locator, Page } from '@playwright/test'
import { Login } from '../pageObject/Login'
import { faker } from '@faker-js/faker'

/**
 * Page Object Model base for SauceDemo.
 */
export class shoppingCart {
    readonly page: Page
    readonly buttonAddToCart: Locator
    readonly buttonRemoveFromCart: Locator

	constructor(page: Page) {
		this.page = page
        this.buttonAddToCart = this.page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')
        this.buttonRemoveFromCart = this.page.locator('[data-test="remove-sauce-labs-backpack"]')
	}
    
    // Method to navigate to the SauceDemo page
	async navigate(): Promise<void> {
		await this.page.goto('https://www.saucedemo.com/')
	}

    // Method to add items to the shopping cart
    async addItems(): Promise<void> {
        await this.navigate();
        const login = new Login(this.page)
        await login.login('standard_user', 'secret_sauce')

        // ADD ITEMS TO THE SHOPPING CART AND VALIDATE THAT THE ITEM WAS ADDED CORRECTLY
        await expect(this.buttonAddToCart).toContainText('Add to cart')
        await this.buttonAddToCart.click();
    }

    async deleteItems(): Promise<void> {
        await this.addItems()
        // DELETE ITEMS FROM THE CART AND VALIDATE THAT THE ITEM WAS DELETED CORRECTLY
        await expect(this.page.locator('[data-test="remove-sauce-labs-backpack"]')).toContainText('Remove')
        await this.page.locator('[data-test="remove-sauce-labs-backpack"]').click()
    }
}
