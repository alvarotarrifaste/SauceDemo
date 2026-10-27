# SauceDemo UI automation

A focused Playwright + TypeScript portfolio project automating [SauceDemo](https://www.saucedemo.com/), Sauce Labs' public demo shopping application.

## Coverage

Five independent Chromium tests cover:

- Successful login reaches a populated product inventory.
- A locked-out user receives the expected error and remains on login.
- Invalid credentials are rejected.
- Adding a backpack updates the badge and puts the expected product and quantity in the cart.
- Removing the backpack empties the cart, survives a reload, and restores its add control in inventory.

The suite is representative rather than exhaustive. Checkout, API testing, other browsers, and full product coverage are outside its scope.

## Stack and structure

Playwright Test, TypeScript, Node.js, npm, and GitHub Actions.

```text
pages/
  LoginPage.ts
  InventoryPage.ts
  CartPage.ts
tests/
  authentication.spec.ts
  cart.spec.ts
test-data/
  users.ts
playwright.config.ts
tsconfig.json
.github/workflows/playwright.yml
```

Page Objects expose page locators and small interactions. Tests own scenario order and business assertions. Public demo credentials live in `test-data/users.ts`; they are test data, not secrets. Each test uses a fresh browser context.

## Run locally

Prerequisites: Node.js 24 LTS, npm, and internet access to SauceDemo.

```bash
git clone https://github.com/alvarotarrifaste/SauceDemo.git
cd SauceDemo
npm ci
npx playwright install chromium
npm run typecheck
npm test
```

On Linux, use `npx playwright install --with-deps chromium` if browser system dependencies are needed.

```bash
npm run test:headed
npm run test:ui
npm test -- tests/cart.spec.ts
npx playwright show-report
```

Headed and UI modes require a graphical desktop. HTML reports are written to `playwright-report/`. Failed tests retain traces and screenshots in `test-results/`; open the report to inspect them.

## CI

[GitHub Actions](https://github.com/alvarotarrifaste/SauceDemo/actions/workflows/playwright.yml) runs on pushes to `main` and pull requests targeting `main`. It uses Node.js 24, runs `npm ci`, installs Chromium with system dependencies, checks TypeScript, and executes the suite with one worker. Reports and failure diagnostics are uploaded as artifacts.

Retries are disabled so a failing first attempt stays visible. Traces are retained on failure without needing a retry.

## Design choices and limits

The architecture deliberately stays small: three Page Objects, two spec files, one credential file, and shared Playwright configuration. Role locators and SauceDemo's `data-test` attributes keep selectors readable. There is no base class or custom fixture layer.

This project demonstrates practical UI automation, basic Page Object organization, meaningful assertions, type checking, and CI diagnostics. SauceDemo is an external public site: availability, UI changes, and demo-data changes can affect results.
