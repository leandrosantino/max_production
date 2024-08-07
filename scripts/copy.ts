import * as fs from 'fs-extra';
import * as path from 'path';

async function copyFiles() {
  const sourceDir = path.join(__dirname, '../database');
  const sourceDbFile = path.join(sourceDir, 'database.sqlite');
  const sourceConfigFile = path.join(__dirname, '../config.json');

  const targetOutDir = path.join(__dirname, '../out/max_production-win32-x64');
  const targetDbDir = path.join(targetOutDir, 'database');
  const targetDbFile = path.join(targetDbDir, 'database.sqlite');
  const targetConfigFile = path.join(targetOutDir, 'config.json');

  try {
    // Ensure the target directory and the database subdirectory exist
    await fs.ensureDir(targetDbDir);

    // Copy the database.sqlite file to the database directory in out
    await fs.copyFile(sourceDbFile, targetDbFile);

    // Copy the config.json file to the root of out
    await fs.copyFile(sourceConfigFile, targetConfigFile);

    console.log('Files copied successfully!');
  } catch (err) {
    console.error('Error copying files:', err);
  }
}

copyFiles();
