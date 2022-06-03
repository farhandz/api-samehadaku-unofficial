const puppeteer = require('puppeteer');
const NewAnime = require('../model/NewAnime');
const path = require('./path');
const moment = require('moment');
const cekk = async () => {
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
          ],
        headless: true,
        defaultViewport: null
        });
        // get detail anime
        return browser;
}

const responseSukses = (res, data ,  message = 'Sukses') => {
    res.send({
        message: message,
        data: data
    });
};

const responseError = (res , status = 500 , message = 'Error') => {
    res.status(status).send({
        message: message,
    })
}

const newAnime= async () => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
              ],
            });
        const page = await browser.newPage();
        await page.goto(`${path.baseUrl}/page/1`);
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
        const date = moment().format('MMMM Do YYYY, h:mm:ss a');;
        await NewAnime.create({date, data: result})
        await browser.close();
        console.log('sukses')
    } catch (error) {
          console.log('error', error.message)
      }
}

const getListAnimeEveryWeek = async() => {
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
                    const img = document.querySelectorAll('.item img')[i].innerText;
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
                // res.send({
                //     message : "sukses",
                //     total: dts.length,
                //     data : dts,
                // })

                console.log("Sukses Masuk")

            }
        }, 8000)
    } catch (error) {
      console(error.message)
    }
}

module.exports = {
    cekk,
    responseError,
    responseSukses,
    newAnime,
    getListAnimeEveryWeek,
}