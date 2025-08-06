import { test, expect, Page } from '@playwright/test';

class Homepage {
  constructor(private page: Page) {}

  // Locators using role-based selectors as required
  get naraLogo() {
    return this.page.getByRole('link', { name: 'NARA' });
  }

  get signInLink() {
    return this.page.getByRole('link', { name: 'Sign in' });
  }

  get signUpLink() {
    return this.page.getByRole('link', { name: 'Sign up' });
  }

  get starOnGitHubLink() {
    return this.page.getByRole('link', { name: 'Star on GitHub' });
  }

  get quickStartLink() {
    return this.page.getByRole('link', { name: 'Quick Start' });
  }

  get mainHeading() {
    return this.page.getByRole('heading', { name: 'NARA Boilerplate' });
  }

  get themeToggleButton() {
    return this.page.getByRole('button', { name: 'Toggle theme' });
  }

  get languageButton() {
    return this.page.getByRole('button', { name: 'Language' });
  }

  // Action methods
  async navigateToHomepage() {
    await this.page.goto('/');
  }

  async clickSignIn() {
    await this.signInLink.click();
  }

  async clickSignUp() {
    await this.signUpLink.click();
  }

  async clickNaraLogo() {
    await this.naraLogo.click();
  }

  async toggleTheme() {
    await this.themeToggleButton.click();
  }

  async openLanguageMenu() {
    await this.languageButton.click();
  }

  // Verification methods using web-first assertions
  async verifyPageTitle() {
    await expect(this.page).toHaveTitle('NARA Boilerplate - Production-Ready React Starter');
  }

  async verifyMainHeadingExists() {
    await expect(this.mainHeading).toBeVisible();
  }

  async verifyNavigationLinksExist() {
    await expect(this.signInLink).toBeVisible();
    await expect(this.signUpLink).toBeVisible();
    await expect(this.naraLogo).toBeVisible();
  }

  async verifyCallToActionButtons() {
    await expect(this.starOnGitHubLink).toBeVisible();
    await expect(this.quickStartLink).toBeVisible();
  }
}

class LoginPage {
  constructor(private page: Page) {}

  // Locators
  get emailInput() {
    return this.page.getByRole('textbox', { name: 'Email' });
  }

  get passwordInput() {
    return this.page.getByRole('textbox', { name: 'Enter your password' });
  }

  get signInButton() {
    return this.page.getByRole('button', { name: 'Sign in' });
  }

  get signUpLink() {
    return this.page.getByRole('link', { name: 'Sign up' });
  }

  get passwordToggleButton() {
    return this.passwordInput.locator('..').getByRole('button');
  }

  // Action methods
  async navigateToLogin() {
    await this.page.goto('/login');
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickSignIn() {
    await this.signInButton.click();
  }

  async clickSignUp() {
    await this.signUpLink.click();
  }

  async togglePasswordVisibility() {
    await this.passwordToggleButton.click();
  }

  async submitLoginForm(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignIn();
  }

  // Verification methods
  async verifyPageTitle() {
    await expect(this.page).toHaveTitle('Sign In - NARA');
  }

  async verifyFormElements() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
    await expect(this.signUpLink).toBeVisible();
  }

  async verifyFormHeading() {
    await expect(this.page.getByText('Sign in')).toBeVisible();
  }
}

class RegisterPage {
  constructor(private page: Page) {}

  // Locators
  get fullNameInput() {
    return this.page.getByRole('textbox', { name: 'Full Name' });
  }

  get emailInput() {
    return this.page.getByRole('textbox', { name: 'Email' });
  }

  get passwordInput() {
    return this.page.getByRole('textbox', { name: 'Create a password' });
  }

  get confirmPasswordInput() {
    return this.page.getByRole('textbox', { name: 'Confirm your password' });
  }

  get createAccountButton() {
    return this.page.getByRole('button', { name: 'Create account' });
  }

  get signInLink() {
    return this.page.getByRole('link', { name: 'Sign in' });
  }

  // Action methods
  async navigateToRegister() {
    await this.page.goto('/register');
  }

  async fillFullName(name: string) {
    await this.fullNameInput.fill(name);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async fillConfirmPassword(password: string) {
    await this.confirmPasswordInput.fill(password);
  }

  async clickCreateAccount() {
    await this.createAccountButton.click();
  }

  async clickSignIn() {
    await this.signInLink.click();
  }

  async submitRegistrationForm(name: string, email: string, password: string) {
    await this.fillFullName(name);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillConfirmPassword(password);
    await this.clickCreateAccount();
  }

  // Verification methods
  async verifyPageTitle() {
    await expect(this.page).toHaveTitle('Create account - NARA');
  }

  async verifyFormElements() {
    await expect(this.fullNameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.confirmPasswordInput).toBeVisible();
    await expect(this.createAccountButton).toBeVisible();
    await expect(this.signInLink).toBeVisible();
  }

  async verifyFormHeading() {
    await expect(this.page.getByText('Create account')).toBeVisible();
  }
}

class ShowcasePage {
  constructor(private page: Page) {}

  // Locators
  get backToHomeLink() {
    return this.page.getByRole('link', { name: 'Back to Home' });
  }

  get showcasesHeading() {
    return this.page.getByRole('heading', { name: 'Showcases' });
  }

  get naraLogo() {
    return this.page.getByRole('link', { name: 'NARA' });
  }

  // Action methods
  async navigateToShowcase() {
    await this.page.goto('/showcase');
  }

  async clickBackToHome() {
    await this.backToHomeLink.click();
  }

  async clickNaraLogo() {
    await this.naraLogo.click();
  }

  // Verification methods
  async verifyPageTitle() {
    await expect(this.page).toHaveTitle('Showcases - NARA Boilerplate - Production-Ready React Starter');
  }

  async verifyPageElements() {
    await expect(this.showcasesHeading).toBeVisible();
    await expect(this.backToHomeLink).toBeVisible();
    await expect(this.naraLogo).toBeVisible();
  }
}

// Test Suite
test.describe('NARA Boilerplate Application', () => {
  test('Homepage loads correctly and displays all elements', async ({ page }) => {
    const homepage = new Homepage(page);
    
    await homepage.navigateToHomepage();
    await homepage.verifyPageTitle();
    await homepage.verifyMainHeadingExists();
    await homepage.verifyNavigationLinksExist();
    await homepage.verifyCallToActionButtons();
  });

  test('Navigation from homepage to login page works', async ({ page }) => {
    const homepage = new Homepage(page);
    const loginPage = new LoginPage(page);
    
    await homepage.navigateToHomepage();
    await homepage.clickSignIn();
    await loginPage.verifyPageTitle();
    await loginPage.verifyFormElements();
  });

  test('Navigation from homepage to register page works', async ({ page }) => {
    const homepage = new Homepage(page);
    const registerPage = new RegisterPage(page);
    
    await homepage.navigateToHomepage();
    await homepage.clickSignUp();
    await registerPage.verifyPageTitle();
    await registerPage.verifyFormElements();
  });

  test('Login page displays correctly with all form elements', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigateToLogin();
    await loginPage.verifyPageTitle();
    await loginPage.verifyFormHeading();
    await loginPage.verifyFormElements();
  });

  test('Login form accepts user input', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigateToLogin();
    await loginPage.fillEmail('test@example.com');
    await loginPage.fillPassword('password123');
    
    await expect(loginPage.emailInput).toHaveValue('test@example.com');
    await expect(loginPage.passwordInput).toHaveValue('password123');
  });

  test('Register page displays correctly with all form elements', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    
    await registerPage.navigateToRegister();
    await registerPage.verifyPageTitle();
    await registerPage.verifyFormHeading();
    await registerPage.verifyFormElements();
  });

  test('Register form accepts user input', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    
    await registerPage.navigateToRegister();
    await registerPage.fillFullName('John Doe');
    await registerPage.fillEmail('john@example.com');
    await registerPage.fillPassword('securepassword');
    await registerPage.fillConfirmPassword('securepassword');
    
    await expect(registerPage.fullNameInput).toHaveValue('John Doe');
    await expect(registerPage.emailInput).toHaveValue('john@example.com');
    await expect(registerPage.passwordInput).toHaveValue('securepassword');
    await expect(registerPage.confirmPasswordInput).toHaveValue('securepassword');
  });

  test('Navigation between login and register pages works', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);
    
    await loginPage.navigateToLogin();
    await loginPage.clickSignUp();
    await registerPage.verifyPageTitle();
    
    await registerPage.clickSignIn();
    await loginPage.verifyPageTitle();
  });

  test('Showcase page displays correctly', async ({ page }) => {
    const showcasePage = new ShowcasePage(page);
    
    await showcasePage.navigateToShowcase();
    await showcasePage.verifyPageTitle();
    await showcasePage.verifyPageElements();
  });

  test('Navigation from showcase back to homepage works', async ({ page }) => {
    const showcasePage = new ShowcasePage(page);
    const homepage = new Homepage(page);
    
    await showcasePage.navigateToShowcase();
    await showcasePage.clickBackToHome();
    await homepage.verifyPageTitle();
  });

  test('NARA logo navigation works from all pages', async ({ page }) => {
    const homepage = new Homepage(page);
    const loginPage = new LoginPage(page);
    const showcasePage = new ShowcasePage(page);
    
    // Test from login page
    await loginPage.navigateToLogin();
    await page.getByRole('link', { name: 'NARA' }).click();
    await homepage.verifyPageTitle();
    
    // Test from showcase page
    await showcasePage.navigateToShowcase();
    await showcasePage.clickNaraLogo();
    await homepage.verifyPageTitle();
  });

  test('Dashboard requires authentication and shows unauthorized message', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'Error' })).toBeVisible();
    await expect(page.getByText('Unauthorized')).toBeVisible();
  });
});