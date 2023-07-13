import { readUserFromFile, writeUsersToFile } from '../utils/fileFunctions';
import http from 'http';
import { IncomingMessageWithBody} from '../middlewares/json';
export interface User {
	id?: number;
	name: string;
	password: string;
}
export class Users {
	constructor(public users: User[] = []) {
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

	async create(user: User) {

		const newUser  = {id: this.generateRandomId(), ...user}
		this.users.push(newUser);
		this.persist();
	
	}
	list(req: http.IncomingMessage, res: http.ServerResponse) {
		
		res.end(JSON.stringify(this.users));
	}
	edit(id: number, data: User) {
		const { name, password } = data;

		const userTofind = this.users.findIndex((user) => user.id === id);
		if (userTofind === -1) {
			throw new Error('User not found');
		}
		if (name && password) {
			return (this.users[userTofind] = { id, ...{ name, password } });
		} else {
			throw new Error('must inform all fields');
		}
	}
	persist() {
		writeUsersToFile(this.users);
	}
}
