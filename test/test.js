
const { expect } = require('chai');
const { takeAndCompareScreenshot } = require('./compareScreenShots.js');
const fs = require('fs');
puppeteer = require('puppeteer');
path = require('path');

describe('👀 screenshots are correct', () => {
  let browser; let page;

  before(async () => {
    if (!fs.existsSync('test/liveSiteImages')) fs.mkdirSync('test/liveSiteImages');
  });

  after(async () => {
    const removeImages = image => new Promise((resolve) => {
      fs.unlink(path.join(__dirname, `./livesiteimages/${image}`), () => {
        resolve(image);
      });
    });
    Promise.all([removeImages('nomobilemegamerger.png'), removeImages('stopthefcc.png'), removeImages('stopthewar.png')]).then((image) => {
      console.log(`${image} has been removed`);
    });
  });

  // beforeEach(async () => {
  //   browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  //   page = await browser.newPage();
  // });

  // // This is ran after every test; clean up after your browser.
  // afterEach(() => {
  //   browser.close();
  // });

  describe('When comparing live site screen shot to original screen shot', () => {
    beforeEach(async () => {
      browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      page = await browser.newPage();
      page.setViewport({ width: 1280, height: 820 });
    });
    afterEach(async () => {
      await browser.close();
    });
    it('stopthefcc live site logos should be the same', async () => {
      const fileName = 'stopthefcc';
      const dir = 'liveSiteImages';
      const url = 'https://stopthefcc.net/';
      const options = {
        path: `test/${dir}/${fileName}.png`,
        fullPage: false,
        clip: {
          x: 0,
          y: 2300,
          width: 1280,
          height: 2000,
        },
      };
      const comparedValue = await takeAndCompareScreenshot(page, url, dir, fileName, options);
      return comparedValue;
    }).timeout(25000);
    it('stopthewar live site logos should be the same', async () => {
      const fileName = 'stopthewar';
      const dir = 'liveSiteImages';
      const url = 'https://stopthewar.us/';
      const options = {
        path: `test/${dir}/${fileName}.png`,
        fullPage: false,
        clip: {
          x: 0,
          y: 3100,
          width: 1280,
          height: 1150,
        },
      };
      const comparedValue = await takeAndCompareScreenshot(page, url, dir, fileName, options);
      return comparedValue;
    }).timeout(25000);
    it('nomobilemegamerger live site logos should be the same', async () => {
      const fileName = 'nomobilemegamerger';
      const options = {
        path: 'test/liveSiteImages/nomobilemegamerger.png',
        fullPage: false,
        clip: {
          x: 0,
          y: 2350,
          width: 1280,
          height: 400,
        },
      };
      const comparedValue = await takeAndCompareScreenshot(page, 'https://nomobilemegamerger.com/demo', 'liveSiteImages', fileName, options);
      return comparedValue;
    }).timeout(25000);
  });
});
