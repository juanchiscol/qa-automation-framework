import type { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to a specific path relative to baseURL
   */
  async goto(path: string): Promise<void> {
    await this.page.goto(path);
    await this.waitForNetworkIdle();
  }

  /**
   * Common wait for network idle to ensure page is loaded
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Helper to wait for a selector to be visible
   */
  async waitForVisible(locator: Locator, timeout = 5000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Gets the current page title
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }
}
