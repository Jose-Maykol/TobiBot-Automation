import db from '../db.js';

export const getAnimeToDownload = async () => {
  try {
    const result = await db.query('SELECT * FROM chapters_to_download');
    return result.rows;
  } catch (error) {
    console.error('Error al obtener capitulos por descargar');
  }
};