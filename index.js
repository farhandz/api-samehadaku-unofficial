const puppeteer = require('puppeteer');

const maxjarak = 10;

async function hasNextPage(page ,ads) {
    
    const hasScroll = await page.$('span[class="HlvSq"]');

    return !hasScroll;
  
    // return !disabled;
  }

 
async function goToNextPage(page) {
    // await page.click('button[aria-label="Halaman berikutnya"]')
    await page.waitForNetworkIdle();
  }

  async function parsePlaces(page) {
    let places = [];
  
    const elements = await page.$$('div[class="Nv2PK THOPZb CpccDe "]');
    // const elements = await page.$$('div[class="lI9IFe "]');
    if (elements && elements.length) {
      for (const el of elements) {

        const image = await el.$('div[class="lI9IFe "] div[class="SpFAAb"] img');
        let address = await el.$('div[class="lI9IFe "] div[class="UaQhfb fontBodyMedium"] div[class="W4Efsd"] div[class="W4Efsd"] ');
        let phone = await el.$('div[class="lI9IFe "] div[class="UaQhfb fontBodyMedium"] div[class="W4Efsd"] div[class="W4Efsd"] div[class="W4Efsd"] ');
        let url = await el.$('a[class="hfpxzc"]');
        // let url = await el.$('div[class="lI9IFe "] div[class="UaQhfb fontBodyMedium"] div[class="W4Efsd"] div[class="W4Efsd"] div[class="W4Efsd"] ');
        let src = '';
        if(image) {
          src  = await image.evaluate(dt => dt.src)
        }

        if(address) {
          address = await address.evaluate(dt => dt.textContent)
        }

        if(phone) {
          phone = await address.evaluate(dt => dt.textContent)
        }

        // address = await address.evaluate(dt => dt.textContent)
        const name = await el.evaluate(span => span.textContent);

        
        url = await url.evaluate(span => span.getAttribute('href'))
        const latitude = getLongLat(url).split(',')[0]
        const longitude = getLongLat(url).split(',')[1]
        places.push({ name, image: src,  address, longlat: getLongLat(url), distance: Math.round(distance(latitude, longitude, '-6.2194013' , '106.8138542,17'))});
      }
    }
    return places;
  }

  const getLongLat = (url) => {
  const matches = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);

  if (matches && matches.length >= 3) {
    const latitude = parseFloat(matches[1]);
    const longitude = parseFloat(matches[2]);
    
     return `${latitude},${longitude}`;
  } else {
    console.log("Latitude and longitude not found in the URL.");
  }
  
  }

  function  distance(lat1, lon1, latKantor, longitudeKantor) {
    const earthRadius = 6371;
  
    const lat1Rad = (parseFloat(lat1) * Math.PI) / 180;
    const lon1Rad = (parseFloat(lon1) * Math.PI) / 180;
    const lat2Rad = (parseFloat(latKantor) * Math.PI) / 180;
    const lon2Rad = (parseFloat(longitudeKantor) * Math.PI) / 180;
  
    
    const latDiff = lat2Rad - lat1Rad;
    const lonDiff = lon2Rad - lon1Rad;
  
    const a = Math.sin(latDiff / 2) ** 2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(lonDiff / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    // Calculate the distance
    const distance = earthRadius * c;
  
    return Math.round(distance); // Distance in kilometers
  }


const distanceMax = (data) => {

  const hasDistanceGreaterThan5 = data.some(item => item.distance >= maxjarak);

  if (hasDistanceGreaterThan5) {
    return false
  } else {

    return true
  }
}

  
  

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });
    let ads = [];
    const page = await browser.newPage();
    // await page.setViewport(VIEWPORT);
    await page.goto('https://www.google.com/maps/search/mixue/@-6.2194013,106.8138542,17/?near=-6.2194013,106.8138542,17');

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
    ads = ads.sort((a, b) => a.distance - b.distance).filter((value, index, self) =>
    index === self.findIndex(obj => obj.name === value.name)
  );
    console.log('ada ' + ads.length + ' frenchise');
     await goToNextPage(page)
    } while (distanceMax(ads));
    console.log("======= done =====")
    // console.log(ads.sort((a, b) => a.distance - b.distance))
    console.log(ads.sort((a, b) => a.distance - b.distance).filter(dt => dt.distance <= maxjarak))
    await browser.close();
})();

