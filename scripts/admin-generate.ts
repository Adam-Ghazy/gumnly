import { randomBytes } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join, sep } from 'node:path';
import { parseArgs } from 'node:util';
import { hashPassword } from '../src/server/auth.ts';

try {
  const { values } = parseArgs({ options: { username: { type: 'string' }, directory: { type: 'string', default: 'data/admin-credentials' } } });
  if (!values.username || !/^[a-zA-Z0-9._@-]{3,100}$/.test(values.username)) throw new Error('invalid username');
  const directory = resolve(values.directory!);
  const publicPath = resolve('public');
  if (directory === publicPath || directory.startsWith(publicPath + sep)) throw new Error('public directory');
  // Exclusive directory creation prevents overwriting credentials or following an existing symlink.
  mkdirSync(directory, { mode: 0o700 });
  const password = randomBytes(32).toString('base64url');
  const hash = await hashPassword(password);
  writeFileSync(join(directory, 'password.txt'), password + '\n', { mode: 0o600, flag: 'wx' });
  writeFileSync(join(directory, 'admin.env'), `ADMIN_USERNAME=${values.username}\nADMIN_PASSWORD_HASH=${hash}\n`, { mode: 0o600, flag: 'wx' });
  console.info('Private credential files created. Import admin.env privately; move password.txt to a password manager, then delete it. No secrets printed.');
} catch {
  console.error('Credential generation failed. Supply a valid --username and a new private --directory whose parent exists. Existing files are never overwritten.');
  process.exitCode = 1;
}
