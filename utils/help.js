const puppeteer = require('puppeteer')
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

module.exports = {
    cekk,
    responseError,
    responseSukses
}