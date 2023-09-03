import puppeteer from 'puppeteer';
import { getAnimeToDownload } from './controllers/anime.controller.js';
import animeScapper from './scrapper.js';

const animeToDownload = await getAnimeToDownload();

if (animeToDownload.length === 0) {
  console.log('No hay anime por descargar')
} else {
  animeToDownload.forEach( async (anime) =>{
    const animeTextSearch = `${anime.subs_name} ${anime.anime_name} 1080 ${anime.chapter.toString().padStart(2, '0')}`
    console.log('Anime: ', anime)
    console.log('Texto a buscar', animeTextSearch);
    const torrentDownload = await animeScapper(animeTextSearch)
    console.log(torrentDownload);
  });
}