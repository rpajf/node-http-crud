import fs from 'fs/promises';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Entity, IEntity } from '../routes/routes';

//work with native __filename and __dirname in node
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const dataBasePath = new URL('../mockDb/db.txt', import.meta.url);

export async function readUserFromFile() {
	try {
		const data = await fs.readFile(dataBasePath, 'utf-8');

		if(data)return JSON.parse(data);
	} catch (error) {
		console.error('Error reading user data:', error);
		return [];
	}
}

export function writeUsersToFile(entities: IEntity[]): void {
	fs.writeFile(dataBasePath, JSON.stringify(entities)).catch((error) => {
		console.error('Error writing user data:', error);
	});
}
process.on('exit', cleanup)
function cleanup(){
  fs.writeFile(dataBasePath, '');
}