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
        headless: false,
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
            headless: false,
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

module.exports = {
    cekk,
    responseError,
    responseSukses,
    newAnime,
}