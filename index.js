import puppeteer from "puppeteer";
import { getAnimeToDownload } from './controllers/anime.controller.js';

const animeToDownload = await getAnimeToDownload();
const animePageUrl = 'https://nyaa.si/';
let animeTextSearch = 'Came Esp One Piece 1080 1072';
const torrent = {
  name: null,
  linkDownload: null,
  size: null,
  date: null
};

if (animeToDownload.length === 0) {
  console.log('No hay anime por descargar')
} else {
  animeToDownload.forEach((anime) =>{
    console.log('Anime: ', anime)
  });
}

(async () => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(animePageUrl);
  // Busqueda de torrents
  await page.type('.search-bar', animeTextSearch);
  await page.waitForXPath('//*[@id="navbar"]/form/div/div[3]/button');
  const [ buttonSearch ] = await page.$x('//*[@id="navbar"]/form/div/div[3]/button');
  await buttonSearch.click();

  await page.waitForXPath('/html/body/div/div[1]/table');
  const tableSearch = await page.$x('/html/body/div/div[1]/table');
  const rowsSearch = await tableSearch[0].$$('tr');

  if (rowsSearch.length > 0) {
    await Promise.all(rowsSearch.slice(1).map(async (row) => {
      const columns = await row.$$('td');
      const torrentFilename = await columns[1].evaluate(node => node.textContent);
      const torrentLinks = await columns[2].$$('a');
      const firstTorrentLink = await torrentLinks[0].getProperty('href')
      const torrentLinkDownload = await firstTorrentLink.jsonValue();
      const torrentSize = await columns[3].evaluate(node => node.textContent);
      const torrentDate = await columns[4].evaluate(node => node.textContent);

      torrent.name = torrentFilename.replace(/\t|\n/g, '')
      torrent.linkDownload = torrentLinkDownload
      torrent.size = torrentSize
      torrent.date = torrentDate

    }));
  } else {
    console.log('No se encontraron resultados');
  } 
  console.log(torrent);
  //await browser.close();
})();