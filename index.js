const puppeteer = require('puppeteer');

async function hasNextPage(page) {
    const element = await page.$('button[aria-label="Halaman berikutnya"]');
    if (!element) {
      throw new Error('not found');
    }
  
    const disabled = await page.evaluate((el) => el.getAttribute('disabled'), element);
    if (disabled) {
      console.log('The next page button is disabled');
    }
  
    return !disabled;
  }

 
async function goToNextPage(page) {
    await page.click('button[aria-label="Halaman berikutnya"]')
    await page.waitForNetworkIdle();
  }


  async function parsePlaces(page) {
    let places = [];
  
    const elements = await page.$$('.fontHeadlineSmall span');
    if (elements && elements.length) {
      for (const el of elements) {
        const name = await el.evaluate(span => span.textContent);
        places.push({ name });
      }
    }
    const element2 = await page.$$('div[class="xwpmRb qisNDe"] img');
    if (element2 && element2.length) {
      for (const el of element2) {
        const img = await el.evaluate(img => img.src);
        places.map((dt) => ({...dt, image: "asaxasxas"}));
      }
    }
  
    return places;
  }


(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });
    let ads = [];
    const page = await browser.newPage();
    // await page.setViewport(VIEWPORT);
    await page.goto('https://www.google.com/maps/search/warteg/@-6.2519614,106.8400639,13z');

    do {
        await page.evaluate( async () => {
            console.log("masuk page evalua")
            await new Promise( async (resolve) => {
            const SizeScroll = 300; 
            const selector = document.querySelectorAll('.ecceSd')[1];
            let totalHeightScroll = 0;
            let totalHeightPage  = selector.scrollHeight;
            let  timer = setInterval( async () => {
                selector.scrollBy(0, SizeScroll);
                totalHeightScroll += SizeScroll;
                if(totalHeightScroll >= totalHeightPage) {
                    clearInterval(timer)
                    resolve()
                } 
            }, 100)
        }) 
    })
    // const dataAddress = await page.$$('.fontHeadlineSmall span')
    ads = ads.concat(await parsePlaces(page))
    console.log('ads ' + ads.length + ' places');
     await goToNextPage(page)
    } while (await hasNextPage(page));
    console.log("done")
    console.log(ads)
    // await browser.close();
})();

