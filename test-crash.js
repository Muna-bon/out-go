import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.error('PAGE ERROR:', error.message));

    // Go to login page
    await page.goto('http://localhost:8080/login', { waitUntil: 'networkidle2' });

    // Fill in login credentials (use a known fake account or just create one)
    // Wait, I can just mock the login or create a test user first.
    // I will just use the register API from the UI

    await page.goto('http://localhost:8080/signup', { waitUntil: 'networkidle2' });

    try {
        await page.type('#name', 'Test User');
        await page.type('#email', 'test2react@example.com');
        await page.type('input[placeholder="Search for a location..."]', 'New York');
        await page.type('#password', 'password123');
        await page.click('#terms'); // It's a checkbox, might need evaluating
        await page.evaluate(() => document.querySelector('#terms').click());

        // submit
        await page.click('button[type="submit"]');

        await new Promise(r => setTimeout(r, 3000));

        console.log("Current URL after signup:", page.url());
    } catch (e) {
        console.log("Signup steps failed:", e);
    }

    await browser.close();
})();
