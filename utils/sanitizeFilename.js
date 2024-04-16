function sanitizeFilename(filename) {
  return filename.replace(/[\\/:\*\?"<>\|]/g, '');
}

export default sanitizeFilename;