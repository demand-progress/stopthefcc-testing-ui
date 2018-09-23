
const { expect } = require('chai');
const { takeAndCompareScreenshot } = require('./compareScreenShots.js');
const { sendEmail } = require('./sendMail.js');
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
    beforeEach(async () => page.setViewport({ width: 1280, height: 800 }));
    it('stopthefcc live site logos should be the same', async () => {
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
      const comparedValue = await takeAndCompareScreenshot(page, 'https://stopthefcc.net/', 'liveSiteImages', 'stopthefcc', options);
      if (comparedValue > 0 || comparedValue < 0) {
        sendEmail('mateo@demandprogress.org');
      }
      return comparedValue;
    }).timeout(6000);
    it('nomobilemegamerger live site logos should be the same', async () => {
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
      const comparedValue = await takeAndCompareScreenshot(page, 'https://nomobilemegamerger.com/demo', 'liveSiteImages', 'nomobilemegamerger', options);
      if (comparedValue > 0 || comparedValue < 0) {
        sendEmail('mateo@demandprogress.org');
      }
      return comparedValue;
    }).timeout(9000);
  });
});
