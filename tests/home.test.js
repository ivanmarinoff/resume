const { test, expect } = require('@playwright/test');

test('Check home page', async ({ page }) => {
    await page.goto('https://ivanmarinoff-resume.onrender.com/');
    const heading = await page.$('p');
    const text = await heading.textContent();
    expect(text).toContain('+359 898 726460');
  });