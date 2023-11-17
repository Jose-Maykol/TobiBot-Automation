import colors from 'colors';
import { getAnimeToDownload } from "../repositories/anime.repository.js";
import animeScapper from '../scrapper.js';

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