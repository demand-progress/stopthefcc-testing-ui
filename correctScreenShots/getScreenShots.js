const puppeteer = require('puppeteer');
const fs = require('fs');
const cloudinary = require('cloudinary');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const correctSiteImages = (url, fileName, clip) => new Promise((resolve, reject) => (async () => {
  const options = {
    path: `./correctScreenShots/screenShots/${fileName}`,
    fullPage: false,
    clip,
  };
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  // Start the browser, go to that page, and take a screenshot.
  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.setViewport({ width: 1280, height: 600 });
  await page.waitFor(5000);
  await page.screenshot(options);
  browser.close();
  if (fs.existsSync(`./correctScreenShots/screenShots/${fileName}`)) {
    cloudinary.uploader.upload(`./correctScreenShots/screenShots/${fileName}`,
    function(result) {
      console.log(result)
      resolve(`Screen shot complete for ${url}`);
    })
  } else {
    const error = new Error(`Screen shot was not taken for ${url}`);
    reject(error);
  }
})());

Promise.all([
  correctSiteImages('https://stopthefcc.net/', 'stopthefcc.png', {
    x: 0,
    y: 2300,
    width: 1280,
    height: 2000,
  }),
  correctSiteImages('https://stopthewar.us/', 'stopthewar.png', {
    x: 0,
    y: 3100,
    width: 1280,
    height: 1150,
  }),
  correctSiteImages('https://nomobilemegamerger.com/', 'nomobilemegamerger.png', {
    x: 0,
    y: 2350,
    width: 1280,
    height: 600,
  }),
]).then((response) => {
  console.log(response);
}).catch((error) => {
  console.log(error);
});
