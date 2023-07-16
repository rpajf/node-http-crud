import { IEntity } from '../types/entity';
import { writeUsersToFile, readUserFromFile } from '../utils/fileFunctions';
import http from 'http';

export class Entity<T extends IEntity> {
	// can get any additional types but required at least
	constructor(public entities: T[] = []) {
		this.initEntities();
	}

	async initEntities() {
		await readUserFromFile();
	}
	generateRandomId() {
		const id = Math.floor(Math.random() * 10) + 1;
		return id;
	}
	async create(entity: Omit<T, 'id'>) {
		const newEntity = { id: this.generateRandomId(), ...entity } as T;
		this.entities.push(newEntity);
		await this.persist();
	}
	list() {
		return this.entities;
	}
	async persist() {
		await writeUsersToFile(this.entities);
	}
	async edit(id: number, newEntityData: Partial<T>) {
		const entityToFindIndex = this.entities.findIndex(
			(newEntity) => newEntity.id === id
		);
		if (entityToFindIndex === -1) {
			throw new Error('Entity not found');
		}
		this.entities[entityToFindIndex] = {
			...this.entities[entityToFindIndex],
			...newEntityData,
		};
		await this.persist();
	}
	async delete(id: number) {
		const entityToFindIndex = this.entities.findIndex(
			(newEntity) => newEntity.id === id
		);
		if (entityToFindIndex === -1) {
			throw new Error('Entity not found');
		}
		this.entities.splice(entityToFindIndex, 1)
		console.log(this.entities)
		await this.persist();
	}
}
