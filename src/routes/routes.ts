import { readUserFromFile, writeUsersToFile } from '../utils/fileFunctions';

export interface User {
	id?: number;
	name: string;
	password: string;
}
export class Users {
	constructor(public users: User[] = []) {
		this.initUsersOnFile();
	}

	async initUsersOnFile() {
		await readUserFromFile();
	}

	generateRandomId() {
		const id = Math.floor(Math.random() * 10) + 1;
		return id;
	}
	push(req) {
		const { name, password } = req;
		const user = { id: this.generateRandomId(), name, password };
		this.users.push(user);
		this.persist();
		return this.users;
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
