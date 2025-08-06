import { test, expect, Page } from '@playwright/test';

// Basic test class demonstrating the principles
class NaraTestFramework {
  constructor(private page: Page) {}

  // Homepage locators using role-based selectors
  get naraLogo() { return this.page.getByRole('link', { name: 'NARA' }); }
  get signInLink() { return this.page.getByRole('link', { name: 'Sign in' }); }
  get signUpLink() { return this.page.getByRole('link', { name: 'Sign up' }); }
  get mainHeading() { return this.page.getByRole('heading', { name: 'NARA Boilerplate' }); }

  // Login page locators
  get emailInput() { return this.page.getByRole('textbox', { name: 'Email' }); }
  get passwordInput() { return this.page.getByRole('textbox', { name: 'Enter your password' }); }
  get signInButton() { return this.page.getByRole('button', { name: 'Sign in' }); }

  // Register page locators
  get fullNameInput() { return this.page.getByRole('textbox', { name: 'Full Name' }); }
  get createAccountButton() { return this.page.getByRole('button', { name: 'Create account' }); }

  // Actions
  async navigateToHome() { await this.page.goto('/'); }
  async navigateToLogin() { await this.page.goto('/login'); }
  async navigateToRegister() { await this.page.goto('/register'); }
  async navigateToDashboard() { await this.page.goto('/dashboard'); }

  // Verification methods using web-first assertions
  async verifyHomepageLoaded() {
    await expect(this.page).toHaveTitle('NARA Boilerplate - Production-Ready React Starter');
    await expect(this.mainHeading).toBeVisible();
  }

  async verifyLoginPageLoaded() {
    await expect(this.page).toHaveTitle('Sign In - NARA');
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }

  async verifyUnauthorizedAccess() {
    await expect(this.page.getByRole('heading', { name: 'Error' })).toBeVisible();
    await expect(this.page.getByText('Unauthorized')).toBeVisible();
  }

  async verifyRegisterPageLoaded() {
    await expect(this.page).toHaveTitle('Create account - NARA');
    await expect(this.fullNameInput).toBeVisible();
  }

  async clickSignUpLink() {
    await this.page.getByRole('link', { name: 'Sign up' }).click();
  }
}

// Simplified test suite that can run with basic setup
test.describe('NARA Application - Basic Tests', () => {
  test('should load homepage correctly', async ({ page }) => {
    const framework = new NaraTestFramework(page);
    
    await framework.navigateToHome();
    await framework.verifyHomepageLoaded();
    
    // Verify navigation elements exist
    await expect(framework.signInLink).toBeVisible();
    await expect(framework.signUpLink).toBeVisible();
    await expect(framework.naraLogo).toBeVisible();
  });

  test('should navigate to login page and display form', async ({ page }) => {
    const framework = new NaraTestFramework(page);
    
    await framework.navigateToLogin();
    await framework.verifyLoginPageLoaded();
    
    // Test form input
    await framework.emailInput.fill('test@example.com');
    await framework.passwordInput.fill('password123');
    
    await expect(framework.emailInput).toHaveValue('test@example.com');
    await expect(framework.passwordInput).toHaveValue('password123');
  });

  test('should show unauthorized for protected routes', async ({ page }) => {
    const framework = new NaraTestFramework(page);
    
    await framework.navigateToDashboard();
    await framework.verifyUnauthorizedAccess();
  });

  test('should handle navigation between pages', async ({ page }) => {
    const framework = new NaraTestFramework(page);
    
    // Start at home
    await framework.navigateToHome();
    await framework.verifyHomepageLoaded();
    
    // Go to login
    await framework.signInLink.click();
    await framework.verifyLoginPageLoaded();
    
    // Go to register
    await framework.clickSignUpLink();
    await framework.verifyRegisterPageLoaded();
  });
});