const puppeteer = require('puppeteer');

const path = require('./utils/path');


(async () => {
    const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
    });
    const page = await browser.newPage();
    // get detail anime
    await page.goto(`https://194.163.183.129/${path.anime}/one-piece/`);

    // judul anime
    const titleAnime = await page.$eval('div[class="infox"] h1', el => el.textContent);
    const descAnime = await page.$eval('div[class="infox"] .desc', el => el.textContent);
    const genreAnime = await page.evaluate(() => Array.from(document.querySelectorAll('div[class="infox"] .genre-info a'), element => element.textContent));
    const detailAnime = await page.evaluate(() => Array.from(document.querySelectorAll('div[class="infox"] .spe span'), element => element.textContent));
    const listEpisode = await page.evaluate( async () => {
        const data = document.querySelectorAll('div[class="mCSB_container"] li');
            let manis = [];
            for (i=0; i< data.length; i++) {
                const date = document.querySelectorAll('div[class="mCSB_container"] li .epsleft .date')[i].innerText;
                const title = document.querySelectorAll('div[class="mCSB_container"] li .epsleft a')[i].innerText;
                const link = document.querySelectorAll('div[class="mCSB_container"] li .epsleft a')[i].href;
                manis.push({date, title, link})
             }
             return manis;    
    });
    
    console.log({
        titleAnime,
        descAnime,
        genreAnime,
        detailAnime,
        listEpisode
    })
    // await page.screenshot({ path: 'example.png' });
    await browser.close();
  })();