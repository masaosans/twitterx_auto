// export_cookies.js
const puppeteer = require('puppeteer');
const fs = require('fs-extra');


(async ()=>{
const browser = await puppeteer.launch({headless:false});
const page = await browser.newPage();
await page.goto('https://x.com/login', {waitUntil:'networkidle2'});
console.log('Please login manually in the opened browser. After login, press Enter here to continue.');
process.stdin.resume();
await new Promise(resolve=>process.stdin.once('data', ()=>resolve()));
const cookies = await page.cookies();
await fs.writeFile('cookies.json', JSON.stringify(cookies, null, 2));
console.log('Saved cookies.json. Now run: cat cookies.json | base64 -w0 (or Windows equivalent) and set that to GitHub secret X_COOKIES_B64');
await browser.close();
process.exit(0);
})();