import cron from 'node-cron';
import { animeSearch, animeToDownload, downloadAnime, downloadTorrent } from './controllers/anime.controller.js';
import colors from 'colors';
import { ANIME_PATH } from './config.js';

console.log(colors.green.bold('\nIniciando ejecucion de TobiBot\n'));

cron.schedule('*/10 * * * *', async () => {
  try {
    const animes = await animeToDownload();
    const currentDate = new Date();
    if (animes) {
      animes.forEach( async (anime) =>{
        const animePath = `${ANIME_PATH}/${anime.name}`;
        const animeDownloadDate = new Date(anime.download_datetime);
        const animeTextSearch = `${anime.subs_name} ${anime.name} 1080p ${anime.chapter.toString().padStart(2, '0')}`;
        if (currentDate >= animeDownloadDate ) {
          const torrentDownload = await animeSearch(animeTextSearch);
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
});