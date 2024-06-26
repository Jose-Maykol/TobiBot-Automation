import colors from 'colors';
import { createNewChapterAnime, getAnimeToDownload, updateChapterAnimeDownloaded } from "../repositories/anime.repository.js";
import animeScapper from '../scrapper.js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import process from 'process'
import { DOWNLOAD_PATH } from '../config.js';
import createFoldersAnime from '../utils/createFoldersAnime.js';

export const animeToDownload = async () => {
  try {
    const animes = await getAnimeToDownload();
    console.log(colors.green('Animes por descargar obtenidos'));
    if (animes.rowCount === 0) {
      console.log('No hay animes por descargar.');
    }
    console.log(colors.green(`\n${animes.length } capitulo(s) por descargar:\n`));
    animes.forEach(anime => {
      console.log(`${colors.bold.white('~ Anime')}: ${anime.name} - ${anime.chapter.toString().padStart(2, '0')}`);
    });
    return animes;
  } catch (error) {
    console.error('Error al obtener capitulos por descargar:\n', error);
  }
}

export const animeSearch = async (animeSearchWords) => {
  try {
    console.log(`${colors.bold.yellow('Buscando:')} ${colors.yellow(animeSearchWords)}\n`);
    const torrent = await animeScapper(animeSearchWords);
    if ( torrent ) {
      console.log(`${colors.green.bold('Torrent encontrado:')} ${torrent.name} - ${torrent.size}`);
      console.log(`${colors.green.bold('Link:')} ${colors.white(torrent.linkDownload)}`);
      return torrent;
    } else {
      console.log(colors.red('No se encontro el torrent'));
      return null;
    }
  } catch (error) {
    console.error('Error al buscar anime:\n', error);
  }
}

export const downloadTorrent = async (urlTorrent, filename) => {
  try {
    console.log(colors.yellow(`\nDescargando: ${filename}\n`));
    const response = await axios.get(urlTorrent, {
      responseType: 'stream'
    }).catch((error) => {
      console.error('Error al descargar torrent:\n', error);
    });
    const destinationPath = path.join(`${DOWNLOAD_PATH}/torrents`, filename);
    response.data.pipe(fs.createWriteStream(destinationPath));
    return new Promise((resolve, reject) => {
      response.data.on('end', () => {
        console.log(colors.yellow(`Archivo descargado en ${destinationPath}\n`));
        resolve(destinationPath);
      })
      response.data.on('error', (error) => {
        reject(error);
      })
    });
  } catch (error) {
    console.error('Error al descargar torrent:\n', error);
  }
}

export const downloadAnime = async (filenameTorrent, pathToDownload) => {
  try {
    await createFoldersAnime(pathToDownload);
    process.chdir(`${DOWNLOAD_PATH}/torrents`);
    console.log(colors.yellow('Ahora trabajando en: ', process.cwd()));
    const comand = `webtorrent "${filenameTorrent}" -o "${pathToDownload}" --download-limit 9437184 --upload-limit 5 --quiet`;
    await exec( comand, { stdio: 'inherit' }, (error, stdout, stderr) => {
      if (error) {
        console.error('Error en descarga de torrent: ', error.message);
      }
      if (stderr) {
        console.error('Error en comando de descarga: ', stderr);
      }
      console.log(colors.bold.green('Descargando:'), stdout);
    });
    console.log(colors.green.bold('Anime descargado con exito\n'));
  } catch (error) {
    console.error('Error al descargar anime:\n', error);
  }
}

export const updateChapterAnime = async (id, torrent) => {
  try {
    console.log(colors.gray.bold(`\nActualizando estado de capitulo\n`));
    await updateChapterAnimeDownloaded(id, torrent);
  } catch (error) {
    console.error('Error al actualizar estado de capitulo:\n', error);
  } finally {
    console.log(colors.green.bold('Capitulo actualizado con exito\n'));
  }
}

export const createNewChapter = async (id) => {
  try {
    console.log(colors.gray.bold(`\nCreando nuevo capitulo\n`));
    const newChapter =  await createNewChapterAnime(id);
    if (newChapter.rowCount !== 0) {
      console.log(colors.green(`\nCreado con exito nuevo capitulo ${newChapter[0].chapter.toString().padStart(2, '0')}\n`));
    }
  } catch (error) {
    console.error('Error al crear nuevo capitulo:\n', error);
  }
}