// @ts-ignore
import Filer from "filer";

const fileSystem = new Filer.FileSystem();
const fs = fileSystem.promises;
const sh = new fileSystem.Shell();

sh.exists = async (path: string) => {
  try {
    await fs.stat(path);
    return true;
  } catch {
    return false;
  }
};

export { fs, sh };
