const { test, expect } = require('@playwright/test');

test('Check home page', async ({ page }) => {
    await page.goto('https://ivanmarinoff-resume.onrender.com/');
    const heading = await page.$('p');
    const text = await heading.textContent();
    expect(text).toContain('+359 898 726460');
  });

test('Check email on home page', async ({ page }) => {
    // Navigate to the website
    await page.goto('https://ivanmarinoff-resume.onrender.com/');

    // Select the element containing the email address
    const heading = await page.$('a');

    // Get the text content of the element
    const text = await heading.textContent();

    // Verify that the email is present in the text
    expect(text).toContain('marinoffivan@gmail.com');
});

test('Check "My Resume" button', async ({ page }) => {
    // Navigate to the website
    await page.goto('https://ivanmarinoff-resume.onrender.com/');

    // Select the "My Resume" button
    const resumeButton = await page.$('text=My Resume'); // This uses text selector to find the button

    // Verify that the button is present
    expect(resumeButton).not.toBeNull();

    // Click the "My Resume" button
    await resumeButton.click();

    // Wait for navigation after clicking the button
    await page.waitForNavigation();

    // Verify that the URL is the expected resume page URL
    expect(page.url()).toBe('https://ivanmarinoff-resume.onrender.com/resume'); // Replace with the actual resume page URL if different

    // Optionally, verify content on the resume page
    const resumeHeading = await page.$('h1'); // Assuming there is a heading on the resume page
    const headingText = await resumeHeading.textContent();
    expect(headingText).toContain('Resume'); // Replace with the actual heading text
});