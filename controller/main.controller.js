const path = require('../utils/path');
const puppeteer = require('puppeteer')

module.exports = {
    getDetailAnime: async (req, res) => {
        try {
            // const {data} = req.params.query
            const url_anime = req.params.url_anime;
            const browser = await puppeteer.launch({
                headless: false,
                defaultViewport: null
                });
                const page = await browser.newPage();
                // get detail anime
                await page.goto(`${path.baseUrl}/${path.anime}/${url_anime}/`);
                const element = await page.$('div[class="infox"]');
                if (!element) {
                  await browser.close();
                  throw new Error('Not Found');
                }
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
            res.status(500).send({
                message: error.message
            })
        }
    },

    getBatch : async () => {
        try {
            const titleAnime = await page.$eval('div[class="animposx"] .title', el => el.textContent);
        } catch (error) {
            
        }
    }
}