
const { expect } = require('chai');
const { takeAndCompareScreenshot } = require('./compareScreenShots.js');
const { sendEmail } = require('./sendMail.js');
const fs = require('fs');
  puppeteer = require('puppeteer');

describe('👀 screenshots are correct', () => {
  let browser; let page;

  before(async () => {
    if (!fs.existsSync('testDir')) fs.mkdirSync('testDir');

    if (!fs.existsSync('testDir/wide')) fs.mkdirSync('testDir/wide');
  });

  beforeEach(async () => {
    browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    page = await browser.newPage();
  });

  // This is ran after every test; clean up after your browser.
  afterEach(() => browser.close());

  describe('When comparing live site screen shot to original screen shot', () => {
    beforeEach(async () => page.setViewport({ width: 1280, height: 800 }));
    it('both should be the same image', async () => {
      const comparedValue = await takeAndCompareScreenshot(page, 'view1', 'wide');
      if (comparedValue > 0 || comparedValue < 0) {
        sendEmail('mateo@demandprogress.org');
      }
      return comparedValue;
    }).timeout(6000);
  });
});
