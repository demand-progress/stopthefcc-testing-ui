const { expect } = require('chai');
const { sendEmail } = require('./sendMail.js');
const fs = require('fs');
PNG = require('pngjs').PNG,
pixelmatch = require('pixelmatch');


const compareScreenshots = (filePath, fileName) => {
  return new Promise((resolve) => {
    const img1 = fs.createReadStream(`./test/${filePath}.png`).pipe(new PNG()).on('parsed', doneReading);
    const img2 = fs.createReadStream(`./correctScreenShots/${fileName}.png`).pipe(new PNG()).on('parsed', doneReading);
    let filesRead = 0;
    function doneReading() {
      if (++filesRead < 2)
        return;
      expect(img1.width, 'image widths are the same').equal(img2.width);
      expect(img1.height, 'image heights are the same').equal(img2.height);
      const diff = new PNG({ width: img1.width, height: img2.height });
      const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, { threshold: 0.9 });
      if (numDiffPixels > 0 || numDiffPixels < 0) {
        // sendEmail('mateo@demandprogress.org', filePath);
      }
      expect(numDiffPixels, 'number of different pixels').equal(0);
      resolve(numDiffPixels);
    }
  });
};

const takeAndCompareScreenshot = async (page, url, dir, fileName, options) => {
  const filePath = `${dir}/${fileName}`;
  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.waitFor(10000);
  await page.screenshot(options);
  return compareScreenshots(filePath, fileName);
}

module.exports = { takeAndCompareScreenshot };
