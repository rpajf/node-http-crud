import fs from 'fs/promises';

import { fileURLToPath } from 'node:url';
import { IEntity } from '../types/entity';
//work with native __filename and __dirname in node
const __filename = fileURLToPath(import.meta.url);
export const dataBasePath = new URL('../mockDb/db.txt', import.meta.url);

export async function readUserFromFile() {
	try {
		const data = await fs.readFile(dataBasePath, 'utf-8');

		if (data) return JSON.parse(data);
	} catch (error) {
		console.error('Error reading user data:', error);
		return [];
	}
}

export async function writeUsersToFile<T extends IEntity>(
	entities: T[]
): Promise<void> {
	fs.writeFile(dataBasePath, JSON.stringify(entities)).catch((error) => {
		console.error('Error writing user data:', error);
	});
}
process.on('exit', cleanup);
function cleanup() {
	fs.writeFile(dataBasePath, '');
}
