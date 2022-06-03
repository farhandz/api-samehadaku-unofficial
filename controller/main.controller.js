const path = require('../utils/path');
const puppeteer = require('puppeteer')
const {cekk, responseSukses, responseError}  = require('../utils/help');
const fs = require('fs');
const DetailAnime = require('../model/DetailAnime');
const DownloadAnime = require('../model/DownloadAnime');
const AnimeList = require('../model/AnimeList');

module.exports = {
    getDetailAnime: async (req, res) => {
        try {
            // const {data} = req.params.query
            const url_anime = req.params.url_anime;
            const isAnimeExisst = await DetailAnime.findOne({titles: url_anime});
            if(isAnimeExisst) {
                return responseSukses(res, isAnimeExisst, "Sukses Get Detail Anime")
            }
            const browser = await puppeteer.launch({
                headless: true,
                defaultViewport: null,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                  ],
                });
                const page = await browser.newPage();
                // get detail anime
                console.log(path.baseUrl)
                await page.goto(`https://194.163.183.129/${path.anime}/${url_anime}/`);
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
                
                const titles = titleAnime.split(' ').filter(e => e != 'Nonton' && e !== 'Subtitle' && e !== 'Indonesia').join(' ');

                await DetailAnime.create({titles, descAnime, genreAnime, detailAnime, listEpisode})
                // await page.screenshot({ path: 'example.png' });
                await browser.close();
            
            responseSukses(res, {titles, descAnime, genreAnime, detailAnime, listEpisode})
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    },

    getBatch : async (req, res) => {
        try {
            const {paging} = !req.query ? null : req.query;
            const page = await cekk().then((data) => data.newPage());
            await page.goto(`${path.baseUrl}/${path.batch}/page/${paging}`);
            const result = await page.evaluate( async() => {
                const data = document.querySelectorAll('div[class="animposx"]');
                if(!data) {
                    await page.close()
                    throw new Error("data not found")
                }
                let manis = [];
                for (i=0; i< data.length; i++) {
                    const img = document.querySelectorAll('div[class="animposx"] img')[i].src;
                    const title = document.querySelectorAll('div[class="animposx"] .title')[i].innerText;
                    const score = document.querySelectorAll('div[class="animposx"] .score')[i].innerText;
                    const status = document.querySelectorAll('div[class="animposx"] .type')[i].innerText;
                    manis.push({img, score, title, status})
                }
                return manis;
            })

            res.send(result);
        } catch (error) {
            console.log(error.message)
        }
    },

    getNewEpisode: async (req, res) => {
      try {
        const paging= !req.query.paging ? 1 : req.query.paging;
        const page = await cekk().then((data) => data.newPage());
        await page.goto(`${path.baseUrl}/page/${paging}`);
        console.log("masuk sini");
        const result = await page.evaluate( async() => {
            console.log("evaluate")
            const data = document.querySelectorAll('.post-show')[0].querySelectorAll('li');
            console.log(data)
            if(!data) {
                await page.close()
                throw new Error("data not found")
            }
            let datas = [];
            for (i=0; i< data.length; i++) {
                const img = document.querySelectorAll('.post-show')[0].querySelectorAll('li .thumb img')[i].src;
                const title = document.querySelectorAll('.post-show')[0].querySelectorAll('li .dtla .entry-title')[i].innerText;;
                const episode = document.querySelectorAll('.post-show')[0].querySelectorAll('li .dtla')[i].childNodes[2].innerText;
                const rilis =  document.querySelectorAll('.post-show')[0].querySelectorAll('li .dtla')[i].childNodes[6].innerText;
                datas.push({img, title, episode, rilis})
            }
            return datas;
        });
        console.log(result);
        res.send(result);
        responseSukses(res, result, "Sukses Get All Anime")
      } catch (error) {
         res.status(500).send(error)
      }
        
    },

    getAllListAnime : async (req, res) => {
        try {
            const listfilter = [
                '0-9', 'A', 'B', 'C', 'D',
                'E',   'F', 'G', 'H', 'I',
                'J',   'K', 'L', 'M', 'N',
                'O',   'P', 'Q', 'R', 'S',
                'T',   'U', 'V', 'W', 'X',
                'Y',   'Z'
            ];
            const browser = await puppeteer.launch({
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                  ],
                headless: true,
                defaultViewport: null
            });
            const page = await browser.newPage();
            let count = 0;
            let dts = []
            var timer = setInterval( async() => {
                count += 1;
                console.log(`******* ******** ******* berjalan selama ${count} ******* ******* ***********`)
                await page.goto(`${path.baseUrl}/a-z/?letter=${listfilter[count]}`);
                let result = await page.evaluate(() => {
                    let datas = [];
                    const dataPage = document.querySelectorAll('.item')
                    for (let i = 0; i < dataPage.length; i++) {
                        const title = document.querySelectorAll('.item .entry-title')[i].innerText;
                        const img = document.querySelectorAll('.item img')[i].src;
                        const description = document.querySelectorAll('.item p')[i].innerText;
                        const download = document.querySelectorAll('.item a')[0].href;
                        datas.push({title, img , description , download})                  
                    }
                    return datas;
                })
                dts.push(...result);
                console.log(...dts)
                if(count == listfilter.length) {
                    clearInterval(timer)
                    await browser.close()
                    fs.writeFile("list-anime.json", JSON.stringify(dts), 'utf8', function (err) {
                        if (err) {
                            console.log("An error occured while writing JSON Object to File.");
                            return console.log(err);
                        }
                        console.log("JSON file has been saved.");
                    });
                    await AnimeList.insertMany(dts)
                    res.send({
                        message : "sukses",
                        total: dts.length,
                        data : dts,
                    })

                }
            }, 8000)
        } catch (error) {
            res.status(500).send(error.message)
        }
    },
    downloadAllAnime: async (req ,res) => {
        try {
            const nameAnime = req.query.anime;
            const isAnimeExisst = await DownloadAnime.findOne({title: nameAnime});
            if(isAnimeExisst) {
                return responseSukses(res, isAnimeExisst);
            }
            const page = await cekk().then((data) => data.newPage());
            await page.goto(`${path.baseUrl}/${nameAnime}`);
            const title = await page.$eval('h1[class="entry-title"]', el => el.textContent);
            if(!title) {
                await browser.close();
                throw new Error('Not Found');
            }
            const result = await page.evaluate( async() => {
            let datas = [];
                const data = document.querySelectorAll('.download-eps');
                for (let index = 0; index < data.length; index++) {
                     let datas2 = [];
                    const type = document.querySelectorAll('.download-eps p')[index].innerText;
                    for (let index2 = 0; index2 < document.querySelectorAll('.download-eps')[index].querySelectorAll('ul li').length; index2++) {
                        const quality = document.querySelectorAll('.download-eps')[index].querySelectorAll('ul li a')[index2].href;
                         datas2.push({quality , type})
                    }
                    datas.push(datas2)
                }
                
                return datas
            });
            
            // convert array of array to single array
            const dataResult = result.reduce((arr, e) => {
                return arr.concat(e)
            }, [])
            
            // group base on source and type download
            let group_to_values = dataResult.reduce(function (obj, item) {
                obj[item.type] = obj[item.type] || [];
                obj[item.type].push(item.quality);
                return obj;
            }, {});
            
            let groups = Object.keys(group_to_values).map(function (key) {
                return {type: key, source: group_to_values[key]};
            });
            
            const response = {
                title,
                data: groups
            }

            await page.close()
            
            await DownloadAnime.create({title: nameAnime, data: response})
              
            responseSukses(res, response, "Sukses Scrape group")
        } catch (error) {
            responseError(res, 500 ,error.message);
        }
    },

    directDownloadRacaty: async(req, res) => {
        try {
            const link = req.query.link;
            const browser = await puppeteer.launch({
                headless: true,
                defaultViewport: null,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                  ],
                });
                const page = await browser.newPage();
                await page.goto(link);
                await page.click('#downloadbtn').click();
                await browser.close();
                responseSukses(res, [], "Sukses Scrape group")
        } catch (error) {
            responseError(res, 500 ,error.message);
        }
    }
}