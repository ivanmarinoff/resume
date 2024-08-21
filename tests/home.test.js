const { test, expect } = require('@playwright/test');

test('Check phone number on home page', async ({ page }) => {
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

    // Verify that the button is enabled
    expect(await resumeButton.isEnabled()).toBe(true);

    // Wait for navigation after clicking the button
});

test('Check "My Resume" button opens PDF in new tab', async ({ page, context }) => {
    // Go to the page containing the link
    await page.goto('https://ivanmarinoff-resume.onrender.com/');

    // Trigger the click and wait for the new page (tab) to open
    const [newPage] = await Promise.all([
        context.waitForEvent('page'),          // Wait for the new tab to be opened
        page.click('text=My Resume:📋')        // Click the link that opens a new tab
    ]);
    console.log('Pages after click:', context.pages().length);

    // Assert that the new page is not the same as the current one
    expect(newPage).not.toBe(page);

    // Assert that the new page has the PDF file
    const pdfContent = await newPage.pdf();
    expect(pdfContent).not.toBeNull();
    await newPage.close();
});