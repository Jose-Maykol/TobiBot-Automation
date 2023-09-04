import { exec } from 'child_process';
import process from 'process';

async function downloadAnime(pathDownload ,filenameTorrent) {

  console.log('Trabajando en: ', process.cwd());
  try {
    process.chdir(pathDownload)
    console.log('Ahora trabajando en: ', process.cwd());
    const comand = `webtorrent "${filenameTorrent}" --upload-limit 1 -o D:/Anime`;
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