const puppeteer = require('puppeteer');

const options = {
  path: './getScreenShots/correctPage.png',
  fullPage: false,
  clip: {
    x: 0,
    y: 2250,
    width: 1280,
    height: 2100,
  },
};

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  // Start the browser, go to that page, and take a screenshot.
  await page.goto('https://stopthefcc.net/', { waitUntil: 'networkidle2' });
  await page.setViewport({ width: 1280, height: 800 });
  await page.screenshot(options);
  browser.close();
})();

