import fs from 'fs/promises';

async function createFoldersAnime(pathToDownload) {
  try {
    await fs.access(pathToDownload)
    console.log('Se ha encontrado la carpeta');
  } catch (error) {
    if (error.code = 'ENOEN') {
      await fs.mkdir(pathToDownload, {recursive: true});
      console.log('Se ha creado una nueva carpeta para el anime')
    } else {
      console.log('Error: ', error)
    }
  }
}

export default createFoldersAnime;