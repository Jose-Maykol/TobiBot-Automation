import db from '../db.js';
import colors from 'colors';

export const getAnimeToDownload = async () => {
  try {
    const result = await db.query('SELECT anime_id AS id, * FROM chapters_to_download');
    return result.rows;
  } catch (error) {
    console.error('Error al obtener capitulos por descargar');
  }
};

export const updateChapterAnimeDownloaded = async (id, torrent) => {
  try {
    const query = `
    UPDATE chapters_download
    SET
      chapter_link = $1,
      filename = $2,
      downloaded = $3,
      downloaded_at = $4
    WHERE
      id = $5;`;
    await db.query(query, [torrent.linkDownload, torrent.name, true, new Date(), id]);
  } catch (error) {
    console.error('Error al actualizar estado de capitulo:\n', error);
  }
};

export const createNewChapterAnime = async (id) => {
  try {
    const result = await db.query('SELECT * FROM animes WHERE id = $1', [id]);
    const anime = result.rows[0];
    const nextChapterDate = new Date(anime.next_chapter_datetime);
    const chapter = anime.current_chapter + 1;
    const query = `
    INSERT INTO chapters_download (anime_id, chapter, download_datetime)
    VALUES ($1, $2, $3)
    RETURNING *;`;
    const queryResult = await db.query(query, [id, chapter, nextChapterDate]);
    return queryResult.rows;
  } catch (error) {
    console.log(colors.red('Error al crear nuevo capitulo:\n', error));
  }
}