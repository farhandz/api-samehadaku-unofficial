const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });
    let ads = [];
    const page = await browser.newPage();
    // await page.setViewport(VIEWPORT);
    await page.goto('https://www.jobstreet.co.id/frontend-jobs?salary=7000000&salary-max=25000000');

    

})();


function autoscroll(page) {

}\