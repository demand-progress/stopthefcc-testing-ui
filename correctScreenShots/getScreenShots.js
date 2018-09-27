const puppeteer = require('puppeteer');
const fs = require('fs');

// make function that will create screen shots of several sites

const correctSiteImages = (url, fileName, clip) => new Promise((resolve, reject) => {
  const options = {
    path: `./correctScreenShots/${fileName}`,
    fullPage: false,
    clip,
  };

  (async () => {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // Start the browser, go to that page, and take a screenshot.
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.setViewport({ width: 1280, height: 820 });
    await page.waitFor(5000);
    await page.screenshot(options);
    browser.close();
    if (fs.existsSync(`./correctScreenShots/${fileName}`)) {
      resolve(`Screen shot complete for ${url}`);
    } else {
      const error = new Error(`Screen shot was not taken for ${url}`);
      reject(error);
    }
  })();
});

Promise.all([
  correctSiteImages('https://stopthefcc.net/', 'stopthefcc.png', {
    x: 0,
    y: 2300,
    width: 1280,
    height: 2000,
  }),
  correctSiteImages('https://stopthewar.us/', 'stopthewar.png', {
    x: 200,
    y: 3330,
    width: 1280,
    height: 820,
  }),
  correctSiteImages('https://nomobilemegamerger.com/demo', 'nomobilemegamerger.png', {
    x: 0,
    y: 2320,
    width: 1280,
    height: 200,
  })
]).then((response) => {
  console.log(response);
}).catch((error) => {
  console.log(error);
});
