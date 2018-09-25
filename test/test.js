
const { expect } = require('chai');
const { takeAndCompareScreenshot } = require('./compareScreenShots.js');
const fs = require('fs');
puppeteer = require('puppeteer');

describe('👀 screenshots are correct', () => {
  let browser; let page;

  before(async () => {
    // if (!fs.existsSync('testDir')) fs.mkdirSync('testDir');

    if (!fs.existsSync('test/liveSiteImages')) fs.mkdirSync('test/liveSiteImages');
  });

  beforeEach(async () => {
    browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    page = await browser.newPage();
  });

  // This is ran after every test; clean up after your browser.
  afterEach(() => browser.close());

  describe('When comparing live site screen shot to original screen shot', () => {
    beforeEach(async () => {
      page.setViewport({ width: 1280, height: 800 });
    });
    it('stopthefcc live site logos should be the same', async () => {
      const fileName = 'stopthefcc'; 
      const options = {
        path: 'test/liveSiteImages/stopthefcc.png',
        fullPage: false,
        clip: {
          x: 0,
          y: 2250,
          width: 1280,
          height: 2100,
        },
      };
      const comparedValue = await takeAndCompareScreenshot(page, 'https://stopthefcc.net/', 'liveSiteImages', fileName, options);
      return comparedValue;
    }).timeout(15000);
    it('nomobilemegamerger live site logos should be the same', async () => {
      const fileName = 'nomobilemegamerger';
      const options = {
        path: 'test/liveSiteImages/nomobilemegamerger.png',
        fullPage: false,
        clip: {
          x: 0,
          y: 2320,
          width: 1280,
          height: 200,
        },
      };
      const comparedValue = await takeAndCompareScreenshot(page, 'https://nomobilemegamerger.com/demo', 'liveSiteImages', fileName, options);
      return comparedValue;
    }).timeout(15000);
  });
});
