const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error));

  await page.goto('http://localhost:8080/profile', { waitUntil: 'networkidle2' });

  await new Promise(r => setTimeout(r, 2000));

  await browser.close();
})();
