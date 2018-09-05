
const { expect } = require('chai');
const fs = require('fs');
PNG = require('pngjs').PNG,
pixelmatch = require('pixelmatch');
puppeteer = require('puppeteer');
// startServer = require('../server.js');

function compareScreenshots(fileName) {
  return new Promise((resolve, reject) => {
    const img1 = fs.createReadStream(`./testDir/${fileName}.png`).pipe(new PNG()).on('parsed', doneReading);
    const img2 = fs.createReadStream('./getScreenShots/correctPage.png').pipe(new PNG()).on('parsed', doneReading);

    let filesRead = 0;
    function doneReading() {
      // Wait until both files are read.
      if (++filesRead < 2) return;

      // The files should be the same size.
      expect(img1.width, 'image widths are the same').equal(img2.width);
      expect(img1.height, 'image heights are the same').equal(img2.height);

      // Do the visual diff.
      const diff = new PNG({ width: img1.width, height: img2.height });
      const numDiffPixels = pixelmatch(
        img1.data, img2.data, diff.data, img1.width, img1.height,
        { threshold: 0.1 },
      );
      // The files should look the same.
      expect(numDiffPixels, 'number of different pixels').equal(0);
      resolve(numDiffPixels);
    }
  });
}
// - page is a reference to the Puppeteer page.
// - route is the path you're loading, which I'm using to name the file.
// - filePrefix is either "wide" or "narrow", since I'm automatically testing both.
async function takeAndCompareScreenshot(page, route, filePrefix) {
  // If you didn't specify a file, use the name of the route.
  const fileName = `${filePrefix}/${route || 'index'}`;

  const options = {
    path: `testDir/${fileName}.png`,
    fullPage: false,
    clip: {
      x: 0,
      y: 2250,
      width: 1280,
      height: 2100,
    },
  };

  // Start the browser, go to that page, and take a screenshot.
  await page.goto('https://stopthefcc.net/', { waitUntil: 'networkidle2' });
  await page.screenshot(options);
  // Test to see if it's right.
  return compareScreenshots(fileName);
}

describe('👀 screenshots are correct', () => {
  let browser; let page;
  // This is ran when the suite starts up.
  before(async () => {
    // This is where you would substitute your python or Express server or whatever.

    // server = await startServer();
    // Create the test directory if needed. This and the goldenDir
    // variables are global somewhere.
    if (!fs.existsSync('testDir')) fs.mkdirSync('testDir');

    // And its wide screen/small screen subdirectories.
    if (!fs.existsSync('testDir/wide')) fs.mkdirSync('testDir/wide');
  });

  // This is ran when the suite is done. Stop your server here.
  // after(done => server.close(done));

  // This is ran before every test. It's where you start a clean browser.
  beforeEach(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });

  // This is ran after every test; clean up after your browser.
  afterEach(() => browser.close());

  // Wide screen tests!
  describe('wide screen', () => {
    beforeEach(async () => page.setViewport({ width: 1280, height: 800 }));
    it('/view1', async () => {
      const comparedValue = await takeAndCompareScreenshot(page, 'view1', 'wide');
      console.log('compared value ', comparedValue);
      if (comparedValue > 0 || comparedValue < 0) {
        // sent email to notify of error
        console.log('if statement ', comparedValue);
      }
      return comparedValue;
    });
    // And your other routes, 404, etc.
  });

  // Narrow screen tests are the same, but with a different viewport.
  // describe('narrow screen', function() {
  //   beforeEach(async function() {
  //     return page.setViewport({width: 375, height: 667});
  //   });
  //   it('/view1', async function() {
  //     return takeAndCompareScreenshot(page, 'view1', 'narrow');
  //   });
  //   // And your other routes, 404, etc.
  // });
});


// module.exports = testing;
