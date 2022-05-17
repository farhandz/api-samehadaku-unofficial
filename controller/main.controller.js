const path = require('../utils/path');
const puppeteer = require('puppeteer')

module.exports = {
    getDetailAnime: async (req, res) => {
        try {
            const browser = await puppeteer.launch({
                headless: true,
                defaultViewport: null
                });
                const page = await browser.newPage();
                // get detail anime
                await page.goto(`${path.baseUrl}/${path.anime}/one-piece/`);
            
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
                
                // await page.screenshot({ path: 'example.png' });
                await browser.close();
            res.json({
                titleAnime,
                descAnime,
                genreAnime,
                detailAnime,
                listEpisode
            });
        } catch (error) {
            res.send({
                message: error.message
            }).status(500)
        }
    }
}