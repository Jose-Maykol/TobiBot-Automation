import cron from 'node-cron';
import { getAnimeToDownload } from './controllers/anime.controller.js';
import animeScapper from './scrapper.js';
import downloadTorrent from './utils/downloadTorrent.js';
import downloadAnime from './utils/downloadAnime.js';
import { ANIME_PATH } from './config.js';

// cron.schedule('*/10 * * * *', async () => { */
  console.log('Iniciando ejecucion ..');
  try {
    const animeToDownload = await getAnimeToDownload();
    if (animeToDownload.length === 0) {
      console.log('No hay animes por descargar.')
    } else {
      animeToDownload.forEach( async (anime) =>{
        const animePath = `${ANIME_PATH}/${anime.name}`;
        const animeTextSearch = `${anime.subs_name} ${anime.name} 1080p ${anime.chapter.toString().padStart(2, '0')}`
        console.log('Anime: ', anime)
        console.log('Texto a buscar', animeTextSearch);
        const torrentDownload = await animeScapper(animeTextSearch)
        console.log(torrentDownload);
        const filenameTorrent = `${torrentDownload.name}.torrent`;
        const linkTorrent = torrentDownload.linkDownload;
        await downloadTorrent(linkTorrent, filenameTorrent);
        await downloadAnime(filenameTorrent, animePath);
      });
    }
  } catch (error) {
    console.error('Error: ', error)
  }
/* }); */