import colors from 'colors';
import { getAnimeToDownload } from "../repositories/anime.repository.js";

export const animeToDownload = async () => {
  try {
    const animes = await getAnimeToDownload();
    console.log(colors.green('Animes por descargar obtenidos'));
    if (animes.rowCount === 0) {
      console.log('No hay animes por descargar.');
    }
    console.log(colors.green(`${animes.length } capitulo(s) por descargar`));
    animes.forEach(anime => {
      console.log(colors.green(`Anime: ${anime.name} - ${anime.chapter.toString().padStart(2, '0')}`));
    });
    return animes;
  } catch (error) {
    console.error('Error al obtener capitulos por descargar', error);
  }
}