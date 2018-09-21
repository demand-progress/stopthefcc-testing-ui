const { expect } = require('chai');
const fs = require('fs');
  PNG = require('pngjs').PNG,
  pixelmatch = require('pixelmatch');


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

module.exports = { takeAndCompareScreenshot };
