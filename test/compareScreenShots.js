const { expect } = require('chai');
const fs = require('fs');
PNG = require('pngjs').PNG,
pixelmatch = require('pixelmatch');


const compareScreenshots = (fileName, path) => {
  return new Promise((resolve) => {
    const img1 = fs.createReadStream(`./test/${fileName}.png`).pipe(new PNG()).on('parsed', doneReading);
    const img2 = fs.createReadStream(`./correctScreenShots/${path}.png`).pipe(new PNG()).on('parsed', doneReading);
    let filesRead = 0;
    function doneReading() {
      if (++filesRead < 2)
        return;
      expect(img1.width, 'image widths are the same').equal(img2.width);
      expect(img1.height, 'image heights are the same').equal(img2.height);
      const diff = new PNG({ width: img1.width, height: img2.height });
      const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, { threshold: 0.1 });
      expect(numDiffPixels, 'number of different pixels').equal(0);
      resolve(numDiffPixels);
    }
  });
};

const takeAndCompareScreenshot = async (page, url, dir, path, options) => {
  const fileName = `${dir}/${path}`;
  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.screenshot(options);
  return compareScreenshots(fileName, path);
}

module.exports = { takeAndCompareScreenshot };
