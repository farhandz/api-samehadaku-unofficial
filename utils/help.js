const puppeteer = require('puppeteer')
const cekk = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null
        });
        // get detail anime
        return browser;
}


module.exports = {
    cekk
}