import cron from 'node-cron';
import { getAnimeToDownload } from './controllers/anime.controller.js';
import animeScapper from './scrapper.js';
import downloadTorrent from './utils/downloadTorrent.js';
import downloadAnime from './utils/downloadAnime.js';

// cron.schedule('*/10 * * * *', async () => { */
  console.log('Iniciando ejecucion ..');
  try {
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
        const filenameTorrent = `${torrentDownload.name}.torrent`;
        const linkTorrent = torrentDownload.linkDownload;
        await downloadTorrent(linkTorrent, filenameTorrent);
        downloadAnime('C:/Users/User/Downloads', filenameTorrent)
      });
    }
  } catch (error) {
    console.error('Error: ', error)
  }
/* }); */