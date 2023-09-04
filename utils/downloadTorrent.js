import { rejects } from 'assert';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

async function downloadTorrent(urlTorrent, filename) {
  try {
    const response = await axios.get(urlTorrent, {responseType: 'stream'});
    const destinationPath = path.join('C:/Users/User/Downloads', filename);

    console.log('Descargando: ', filename);

    response.data.pipe(fs.createWriteStream(destinationPath));

    return new Promise((resolve, reject) => {
      response.data.on('end', () => {
        console.log(`Archivo descargado en ${destinationPath}`);
        resolve(destinationPath);
      })
      response.data.on('error', (error) => {
        reject(error);
      })
    });
  } catch (error) {
    console.error('Error: ', error)
  }
}

export default downloadTorrent;