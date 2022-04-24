const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path')

const url = "";
const pass = "";
//const url = process.argv[2];
//const pass = process.argv[3];

(async () => {
    const browser = await puppeteer.launch({headless: false, slowMo: 10,});
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('#passwd');
    await page.type("#passwd", pass);
    await page.click('input[type="submit"]');
    await page.waitForSelector('a');
    const links = await page.$$('a');
    const linksArray = [];
    for(let j = 0; j< links.length; j++){
        linksArray.push(await (await links[j].getProperty('href')).jsonValue());
    }
    
    for (let i = 0; i < linksArray.length; i++) {
        const targetUrl = linksArray[i];
        const filename = targetUrl.split('/').pop();
        const viewSource = await page.goto(targetUrl);
        const localfilefullpath = path.join(__dirname + '/images' , filename);
        fs.writeFile(localfilefullpath, await viewSource.buffer(), (error) => {
            if (error) {
              console.log(`error=${error}`);
              return;
            }
            console.log(filename + ' was saved');
          });
          await page.goBack();
        //console.log(await (await links[i].getProperty('href')).jsonValue())
      }
      

    await browser.close();
  })();