import fs from 'fs';
import path from 'path';
import util from 'util';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const deleteFile = util.promisify(fs.unlink);
const execPromise = util.promisify(exec);

export const PIG_LEV_FNAME_LEN = 32;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getPigData(datFilePath, tempDir) {
  // Write the configuration file for okev
  const configFilePath = path.join(tempDir, 'config.cfg');
  const configContent = `
  dat_dir             "dat"
  lev_dir             "lev"
  rec_dir             "rec"
  pig_dir             "pig"
  `;
  await writeFile(configFilePath, configContent);

  const datFilename = path.basename(datFilePath);

  // Run okev to create the .pig and .rec files
  const okevPath = path.join(__dirname, 'bin', 'okev');
  const okevArgs = [datFilename, 'output.rec', 'output.pig'];
  const { stderr } = await execPromise(`${okevPath} ${okevArgs.join(' ')}`, {
    cwd: tempDir,
  });
  if (stderr) {
    console.log(`okev error: ${stderr}`);
  }

  // Read the .pig file
  const data = await readFile(path.join(tempDir, 'pig', 'output.pig'));

  let offset = 0;

  const pig = {
    magic: data.readUInt32LE(offset),
    version: data.readUInt32LE((offset += 4)),
    lev_id: data.readUInt32LE((offset += 4)),
  };

  const lev_fname_end = data.indexOf('\x00', (offset += 4));
  pig.lev_fname = data.toString('utf8', offset, lev_fname_end);

  offset += PIG_LEV_FNAME_LEN;

  Object.assign(pig, {
    time: data.readUInt32LE(offset),
    finished: data.readInt32LE((offset += 4)),
    dead: data.readInt32LE((offset += 4)),
    interr: data.readInt32LE((offset += 4)),
    fps_avg: data.readFloatLE((offset += 4)),
    ft_range: data.readUInt32LE((offset += 4)),
    ft_range2: data.readUInt32LE((offset += 4)),
    bug_time: data.readUInt32LE((offset += 4)),
    bug_factor: data.readFloatLE((offset += 4)),
  });

  await deleteFile(path.join(tempDir, 'rec', 'output.rec'));
  await deleteFile(path.join(tempDir, 'pig', 'output.pig'));
  await deleteFile(path.join(tempDir, 'config.cfg'));

  return pig;
}
