import cron from 'node-cron';
import { getAnimeToDownload } from './controllers/anime.controller.js';
import animeScapper from './scrapper.js';
import downloadTorrent from './utils/downloadTorrent.js';
import downloadAnime from './utils/downloadAnime.js';
import colors from 'colors';
import { ANIME_PATH } from './config.js';

console.log(colors.green.bold('Iniciando ejecucion de TobiBot'));
// cron.schedule('*/10 * * * *', async () => { */
  try {
    const animeToDownload = await getAnimeToDownload();
    const currentDate = new Date();
    if (animeToDownload.length === 0) {
      console.log('No hay animes por descargar.');
    } else {
      animeToDownload.forEach( async (anime) =>{
        const animePath = `${ANIME_PATH}/${anime.name}`;
        const animeDownloadDate = new Date(anime.download_datetime);
        const animeTextSearch = `${anime.subs_name} ${anime.name} 1080p ${anime.chapter.toString().padStart(2, '0')}`;
        console.log(colors.green(`Pendiente - ${anime.name}`));
        if (currentDate >= animeDownloadDate ) {
          console.log(colors.yellow(`Buscando: ${animeTextSearch}`));
          const torrentDownload = await animeScapper(animeTextSearch);
          console.log(colors.white(`\b Torrent: ${torrentDownload.name} - ${torrentDownload.size}`));
          console.log(colors.white(`\b Link: ${torrentDownload.linkDownload}`));
          const filenameTorrent = `${torrentDownload.name}.torrent`;
          const linkTorrent = torrentDownload.linkDownload;
          await downloadTorrent(linkTorrent, filenameTorrent);
          await downloadAnime(filenameTorrent, animePath);
        } else {
          console.log(colors.red(`Aun no es la fecha de descarga para ${anime.name} - ${anime.chapter.toString().padStart(2,'0')}`));
        }
      });
    }
  } catch (error) {
    console.error('Error: ', error)
  }
/* }); */