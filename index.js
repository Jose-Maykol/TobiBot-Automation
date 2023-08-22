import puppeteer from "puppeteer";

(async () => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('https://nyaa.si/');
  // Busqueda de torrents
  await page.type('.search-bar', 'Came Esp One Piece 1080 1072');
  await page.waitForXPath('//*[@id="navbar"]/form/div/div[3]/button');
  const [ buttonSearch ] = await page.$x('//*[@id="navbar"]/form/div/div[3]/button');
  await buttonSearch.click();

  await page.waitForXPath('/html/body/div/div[1]/table');
  const tableSearch = await page.$x('/html/body/div/div[1]/table');
  const rowsSearch = await tableSearch[0].$$('tr');

  const valuesSearch = [];

  if (rowsSearch.length > 0) {
    await Promise.all(rowsSearch.slice(1).map(async (row) => {
      const columns = await row.$$('td');
      const torrentFilename = await columns[1].evaluate(node => node.textContent);
      //const TorrentLink = await columns[2].evaluate(node => node.innerText);
      const torrentSize = await columns[3].evaluate(node => node.textContent);
      const torrentDate = await columns[4].evaluate(node => node.textContent);
      valuesSearch.push([torrentFilename, torrentSize, torrentDate]);
    }));
  } else {
    console.log('No se encontraron resultados');
  } 
  console.log(valuesSearch);
  //await browser.close();
})();