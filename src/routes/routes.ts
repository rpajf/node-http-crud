import { readUserFromFile, writeUsersToFile } from '../utils/fileFunctions';
import http from 'http';
import { IncomingMessageWithBody} from '../middlewares/json';
export interface IEntity {
	[key: string]: unknown
}
export class Entity {
	constructor(public entities: IEntity[] = []) {
		console.log('initialized');
		this.initUsersOnFile();
	}

	async initUsersOnFile() {
		await readUserFromFile();
	}

	generateRandomId() {
		const id = Math.floor(Math.random() * 10) + 1;
		return id;
	}

	async create(entity: IEntity) {

		const newEntity  = {id: this.generateRandomId(), ...entity}
		this.entities.push(newEntity);
		this.persist();
	
	}
	list(req: http.IncomingMessage, res: http.ServerResponse) {
		
		res.end(JSON.stringify(this.entities));
	}
	edit(id: number, data: IEntity) {
		const { name, password } = data;

		const entityToFind = this.entities.findIndex((user) => user.id === id);
		if (entityToFind === -1) {
			throw new Error('User not found');
		}
		if (name && password) {
			return (this.entities[entityToFind] = { id, ...{ name, password } });
		} else {
			throw new Error('must inform all fields');
		}
	}
	// delete(id: number, data: IEntity) {
	// 	const { name, password } = data;

	// 	const userTofind = this.entities.findIndex((user) => user.id === id);
	// 	if (userTofind === -1) {
	// 		throw new Error('User not found');
	// 	}
	// 	if (name && password) {
	// 		return (this.entities[entityToFind] = { id, ...{ name, password } });
	// 	} else {
	// 		throw new Error('must inform all fields');
	// 	}
	// }
	persist() {
		writeUsersToFile(this.entities);
	}
}
