// utils/file.utils.ts
import { unlink } from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(unlink);

export const deleteFile = async (filePath: string) => {
  try {
    await unlinkAsync(filePath);
    console.log(`Deleted file: ${filePath}`);
  } catch (err) {
    console.error(`Error deleting file: ${filePath}`, err);
  }
};
