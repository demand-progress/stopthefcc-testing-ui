
const { expect } = require('chai');
const fs = require('fs');
  PNG = require('pngjs').PNG,
  pixelmatch = require('pixelmatch');
  puppeteer = require('puppeteer');
  Mailgun = require('mailgun-js');

let mailGunDomainKey;
let mailgunApiKey;

if (!process.env.MAILGUN_API_KEY) {
  const {domain, apiKey } = require('../config.js');
  mailGunDomainKey = domain;
  mailgunApiKey = apiKey;
}

function compareScreenshots(fileName) {

  return new Promise((resolve) => {
    const img1 = fs.createReadStream(`./testDir/${fileName}.png`).pipe(new PNG()).on('parsed', doneReading);
    const img2 = fs.createReadStream('./getScreenShots/correctPage.png').pipe(new PNG()).on('parsed', doneReading);
  
    let filesRead = 0;
    function doneReading() {
      if (++filesRead < 2) return;

      expect(img1.width, 'image widths are the same').equal(img2.width);
      expect(img1.height, 'image heights are the same').equal(img2.height);

      const diff = new PNG({ width: img1.width, height: img2.height });
      const numDiffPixels = pixelmatch(
        img1.data, img2.data, diff.data, img1.width, img1.height,
        { threshold: 0.1 },
      );
      expect(numDiffPixels, 'number of different pixels').equal(0);
      resolve(numDiffPixels);
    }
  });
}

async function takeAndCompareScreenshot(page, route, filePrefix) {
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
 
  await page.goto('https://stopthefcc.net/', { waitUntil: 'networkidle2' });
  await page.screenshot(options);

  return compareScreenshots(fileName);
}

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
        // sent email to notify of error
        const apiKeyz = process.env.MAILGUN_API_KEY || mailgunApiKey;
        const domainz = process.env.MAILGUN_DOMAIN || mailGunDomainKey;
        const mailgun = new Mailgun({ apiKey: apiKeyz, domain: domainz });
        const filepath = path.join(__dirname, '../testDir/wide/view1.png');
        const data = {
          from: 'mateo.balcorta@gmail.com',
          to: 'mateo.balcorta@gmail.com',
          subject: 'Stopthefcc.org site has an error',
          text: 'Review site for issues',
          attachment: filepath,
        };

        // Sending the email
        mailgun.messages().send(data, (error, body) => {
          if (error) {
            console.log('we have an error: ', error);
          } else {
            console.log('email on its way', body);
          }
        });
      }
      return comparedValue;
    }).timeout(6000);
  });
});
