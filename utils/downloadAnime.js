import { exec } from 'child_process';
import process from 'process';
import { DOWNLOAD_PATH } from '../config.js';
import createFoldersAnime from './createFoldersAnime.js';

async function downloadAnime(filenameTorrent, pathToDownload) {
  try {
    await createFoldersAnime(pathToDownload);
    process.chdir(`${DOWNLOAD_PATH}/Torrents`);
    console.log('Ahora trabajando en: ', process.cwd());
    const comand = `webtorrent "${filenameTorrent}" -o "${pathToDownload}" --download-limit 9437184 --upload-limit 5`;
    exec( comand, { stdio: 'inherit' }, (error, stdout, stderr) => {
      if (error) {
        console.error('Error en descarga de torrent: ', error.message)
      }
      if (stderr) {
        console.error('Error en comando de descarga: ', stderr)
      }
      console.log('Descargando: ', stdout)
    });
  } catch (error) {
    console.error('Error while changing directory: ', error);
  }
}

export default downloadAnime;